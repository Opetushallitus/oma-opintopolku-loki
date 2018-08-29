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

  val scheme_authority = "https://virkailija.testiopintopolku.fi"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}/kayttooikeus-service/kayttooikeus/kayttaja?oidHenkilo=${oid}"
  def organizationDetailsURL(oid: String) = s"${scheme_authority}/organisaatio-service/rest/organisaatio/v3/${oid}?includeImage=false"

  val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)
  val casClient = new CasClient(scheme_authority, blazeHttpClient)

  val max_api_call_duration = Duration(30, "seconds")

  def getOrganizationIdsForUser(oid: String): Array[OrganizationPermission] = {

    val permissionClient = Http(casAuthenticatingClient(Params.permission))
    val users: Array[User] =
     permissionClient.get(userOrganizationsURL(oid))(parseResponse[Array[User]]).runFor(max_api_call_duration)

    users.flatMap(user => user.organisaatiot)
  }

  def getOrganizationsForUser(oid: String): Array[Organization] = {

    val organizationClient = Http(blazeHttpClient)

    val organizations = getOrganizationIdsForUser(oid)

    organizations.map(org => {
      organizationClient.get(organizationDetailsURL(org.organisaatioOid))(parseResponse[Organization]).runFor(max_api_call_duration)
    })
  }

  private def casAuthenticatingClient(casParams: CasParams) = {
    CasAuthenticatingClient(
      casClient,
      casParams,
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

case class User(oidHenkilo: String, username: String, kayttajaTyyppi: String, organisaatiot: Array[OrganizationPermission])
case class OrganizationPermission(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)

case class Organization(oid: String, nimi: OrganizationName)
case class OrganizationName(fi: Option[String], sv: Option[String], en: Option[String])
