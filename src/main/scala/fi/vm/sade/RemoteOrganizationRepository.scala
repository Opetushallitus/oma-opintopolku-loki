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


  def heikki_testaa = "1.2.246.562.24.36742098962"
  def auditlog = "1.2.246.562.24.27696726056"

  val scheme_authority = "https://virkailija.testiopintopolku.fi"
  val permissions_service = "/kayttooikeus-service"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}${permissions_service}/kayttooikeus/kayttaja?oidHenkilo=${oid}"

  val organisaatio = "https://virkailija.opintopolku.fi/organisaatio-service/rest/organisaatio/v3/1.2.246.562.10.00000000001?includeImage=false"

  val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)
  val casClient = new CasClient(scheme_authority, blazeHttpClient)

  def getOrganization(organizationOid: String) = {

    val client = Http(permissionsCasClient)

    val users: Array[User] =
     client.get(userOrganizationsURL(heikki_testaa))(parseResponse[Array[User]]).runFor(Duration(30, "seconds"))

    val organisaatiot: Array[Organization] = users.flatMap(user => user.organisaatiot)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

    client.get(organisaatio)(printResponse).runFor(Duration(30, "seconds"))

  }

  private val permissionsCasClient = {
    CasAuthenticatingClient(
      casClient,
      Params.permission,
      blazeHttpClient,
      Some(AuditLogParserSubSystemCode.code),
      sessionCookieName
    )
  }

  def parseResponse[T](status: Int, body: String, request: Request)(implicit m: Manifest[T]): T = {
    // TODO: Error handling
    parse(body).extract[T]
  }

  def printResponse(status: Int, body: String, request: Request) = {
    println(s"Response code: ${status}, body: ${body}")
  }
}

object AuditLogParserSubSystemCode {
  val code = "auditlog"
}

object Params {
  private val permission_path = "/kayttooikeus-service"

  private def username = sys.env("username")
  private def password = sys.env("password")

  def permission: CasParams = CasParams(permission_path, username, password)
}

case class User(oidHenkilo: String, username: String, kayttajaTyyppi: String, organisaatiot: Array[Organization])
case class Organization(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)
