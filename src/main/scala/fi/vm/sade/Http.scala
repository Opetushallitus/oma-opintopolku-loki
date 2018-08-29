package fi.vm.sade

import org.http4s.{Header, Request, Uri}
import org.http4s.client.Client
import scalaz.{-\/, \/-}
import scalaz.concurrent.Task

case class Http(client: Client) {

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

  type Decode[ResultType] = (Int, String, Request) => ResultType

  def uriFromString(uri: String): Uri = {
    Uri.fromString(uri) match {
      case \/-(result) => result
      case -\/(failure) =>
        throw new IllegalArgumentException("Cannot create URI: " + uri + ": " + failure)
    }
  }
}
