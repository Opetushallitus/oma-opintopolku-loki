package fi.vm.sade

import fi.vm.sade.utils.cas.{CasAuthenticatingClient, CasClient, CasParams}
import org.http4s.{Request}
import org.http4s.client.{blaze}

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

  val organisaatio = "https://virkailija.opintopolku.fi/organisaatio-service/rest/organisaatio/v3/1.2.246.562.10.00000000001?includeImage=false"

  val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)

  def getOrganization(organizationOid: String) = {

    val client = Http(casClient)

    val users: Array[User] =
     client.get(userOrganizationsURL(heikki_testaa))(parseResponse[Array[User]]).runFor(Duration(30, "seconds"))

    val organisaatiot: Array[Organization] = users.flatMap(user => user.organisaatiot)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

  }

  private val casClient = {
    val casClient = new CasClient(scheme_authority, blazeHttpClient)

    CasAuthenticatingClient(
      casClient,
      CasParams(käyttöoikeus_service, username, password),
      blazeHttpClient,
      Some(AuditLogParserSubSystemCode.code),
      sessionCookieName
    )
  }

  def parseResponse[T](status: Int, body: String, request: Request)(implicit m: Manifest[T]): T = {
    // TODO: Error handling
    parse(body).extract[T]
  }
}



object AuditLogParserSubSystemCode {
  val code = "auditlog"
}

case class User(oidHenkilo: String, username: String, kayttajaTyyppi: String, organisaatiot: Array[Organization])
case class Organization(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)
