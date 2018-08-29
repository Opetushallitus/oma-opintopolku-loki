package fi.vm.sade

import fi.vm.sade.utils.cas.{CasAuthenticatingClient, CasClient, CasParams}
import org.http4s.{Header, Request, Uri}
import org.http4s.client.{Client, blaze}
import scalaz.{-\/, \/-}
import scalaz.concurrent.Task

import org.json4s._
import org.json4s.jackson.JsonMethods._

import scala.concurrent.duration.Duration


class RemoteOrganizationRepository {

  implicit val formats = DefaultFormats

  val sessionCookieName = "JSESSIONID"

  val maxHttpRequestThreads = 10

  def username = sys.env("username")
  def password = sys.env("password")

  def heikki_testaa = "1.2.246.562.24.36742098962"
  def auditlog = "1.2.246.562.24.27696726056"

  val scheme_authority = "https://virkailija.testiopintopolku.fi"
  val käyttöoikeus_service = "/kayttooikeus-service"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}${käyttöoikeus_service}/kayttooikeus/kayttaja?oidHenkilo=${oid}"

  def getOrganization(organizationOid: String) = {

    val client = Http(getCasClient)

    val users: Array[User] =
     client.get(userOrganizationsURL(heikki_testaa))(parseResponse[Array[User]]).runFor(Duration(30, "seconds"))

    val organisaatiot: Array[Organization] = users.flatMap(user => user.organisaatiot)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

  }

  private def getCasClient = {
    val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)
    val casClient = new CasClient(scheme_authority, blazeHttpClient)

    val httpClient = CasAuthenticatingClient(
      casClient,
      CasParams(käyttöoikeus_service, username, password),
      blazeHttpClient,
      Some(AuditLogParserSubSystemCode.code),
      sessionCookieName
    )
    httpClient
  }

  def parseResponse[T](status: Int, body: String, request: Request)(implicit m: Manifest[T]): T = {
    // TODO: Error handling
    parse(body).extract[T]
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

case class User(oidHenkilo: String, username: String, kayttajaTyyppi: String, organisaatiot: Array[Organization])
case class Organization(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)
