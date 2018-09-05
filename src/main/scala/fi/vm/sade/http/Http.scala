package fi.vm.sade.http

import fi.vm.sade.AuditLogParserSubSystemCode
import fi.vm.sade.Configuration.{maxHttpRequestThreads, scheme_authority}
import org.http4s.client.{Client, blaze}
import org.http4s.{Header, Request, Uri}
import scalaz.concurrent.Task
import scalaz.{-\/, \/-}

trait HttpClient {
  type Decode[ResultType] = (Int, String, Request) => ResultType

  def get[ResultType](uri: String)(decode: Decode[ResultType]): Task[ResultType]
}

object Http {
  val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)

  def apply(useCas: Boolean = false): HttpClient = {
    if (useCas) {
      new Http(CasHttpClient(blazeHttpClient, scheme_authority))
    } else {
      new Http(blazeHttpClient)
    }
  }
}

private class Http(client: Client) extends HttpClient {

  def get[ResultType](uri: String)(decode: Decode[ResultType]): Task[ResultType] = {
    processRequest(Request(uri = uriFromString(uri)))(decode)
  }

  private def processRequest[ResultType](request: Request)(decoder: (Int, String, Request) => ResultType): Task[ResultType] = {
    client.fetch(addTrackingHeader(request)) { response =>
      response.as[String].map { text => // Might be able to optimize by not turning into String here
        decoder(response.status.code, text, request)
      }
    }
  }

  private def addTrackingHeader(request: Request) = request.copy(headers = request.headers.put(
    Header("clientSubSystemCode", AuditLogParserSubSystemCode.code)
  ))

  def uriFromString(uri: String): Uri = {
    Uri.fromString(uri) match {
      case \/-(result) => result
      case -\/(failure) =>
        throw new IllegalArgumentException("Cannot create URI: " + uri + ": " + failure)
    }
  }
}
