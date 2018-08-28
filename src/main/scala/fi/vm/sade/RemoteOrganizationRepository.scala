package fi.vm.sade

import fi.vm.sade.utils.cas.{CasAuthenticatingClient, CasClient, CasParams}
import org.http4s.{Header, Request, Uri}
import org.http4s.client.{Client, blaze}
import scalaz.{-\/, \/-}
import scalaz.concurrent.Task

class RemoteOrganizationRepository {

  val sessionCookieName = "JSESSIONID"

  val maxHttpRequestThreads = 10

  def username = sys.env("username")
  def password = sys.env("password")

  def getOrganization(organizationOid: String) = {

    val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)
    val casClient = new CasClient("https://virkailija.testiopintopolku.fi", blazeHttpClient)

    val httpClient = CasAuthenticatingClient(
      casClient,
      CasParams("/kayttooikeus-service", username, password),
      blazeHttpClient,
      Some(AuditLogParserSubSystemCode.code),
      sessionCookieName
    )

    val client = Http(httpClient)


    client.get("https://virkailija.testiopintopolku.fi/kayttooikeus-service/kayttooikeus/kayttaja?username=heikki_testaa")(printResult).runFor(200000)
  }

  def printResult(status: Int, text: String, request: Request) = {
    println(s"Received response code ${status} with body ${text}")
  }

}

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

object AuditLogParserSubSystemCode {
  val code = "auditlog"
}
