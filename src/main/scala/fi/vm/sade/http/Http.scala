package fi.vm.sade.http

import fi.vm.sade.conf.Configuration._
import org.http4s.client.{Client, blaze}
import org.http4s.{Header, Request, Uri}
import scalaz.concurrent.Task

trait HttpClient {
  type Decode[ResultType] = (Int, String, Request) => ResultType

  def get[ResultType](uri: Uri)(decode: Decode[ResultType]): Task[ResultType]
}

object Http {
  def apply(useCas: Boolean = false): HttpClient = {
    val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxRequestThreads)

    if (useCas) {
      new Http(CasHttpClient(blazeHttpClient, baseURI.renderString))
    } else {
      new Http(blazeHttpClient)
    }
  }
}

private class Http(client: Client) extends HttpClient {

  def get[ResultType](uri: Uri)(decode: Decode[ResultType]): Task[ResultType] = {
    processRequest(Request(uri = uri))(decode)
  }

  private def processRequest[ResultType](request: Request)(decoder: (Int, String, Request) => ResultType): Task[ResultType] = {
    client.fetch(addTrackingHeader(request)) { response =>
      response.as[String].map { text => // Might be able to optimize by not turning into String here
        decoder(response.status.code, text, request)
      }
    }
  }

  private def addTrackingHeader(request: Request) = request.copy(headers = request.headers.put(
    Header("clientSubSystemCode", AuditLogParserSubsystemCode.code)
  ))
}
