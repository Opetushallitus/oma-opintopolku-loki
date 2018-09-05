package fi.vm.sade

import org.http4s.{Request}
import org.http4s.client.{blaze}
import org.json4s._
import org.json4s.jackson.JsonMethods._
import scala.concurrent.duration.Duration

class RemoteOrganizationRepository {

  implicit val formats = DefaultFormats

  val maxHttpRequestThreads = 10

  val scheme_authority = "https://virkailija.testiopintopolku.fi"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}/kayttooikeus-service/kayttooikeus/kayttaja?oidHenkilo=${oid}"
  def organizationDetailsURL(oid: String) = s"${scheme_authority}/organisaatio-service/rest/organisaatio/v3/${oid}?includeImage=false"

  val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)
  val max_api_call_duration = Duration(30, "seconds")

  def getOrganizationIdsForUser(oid: String): Array[OrganizationPermission] = {

    val permissionClient = Http(CasHttpClient(blazeHttpClient, scheme_authority))
    val users: Array[User] = permissionClient.get(userOrganizationsURL(oid))(parseResponse[Array[User]])
       .runFor(max_api_call_duration)

    users.flatMap(user => user.organisaatiot)
  }

  def getOrganizationsForUser(oid: String): Array[Organization] = {

    val organizationClient = Http(blazeHttpClient)

    val organizations = getOrganizationIdsForUser(oid)

    organizations.map(org => organizationClient.get(organizationDetailsURL(org.organisaatioOid))(parseResponse[Organization])
      .runFor(max_api_call_duration)
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



case class User(oidHenkilo: String, username: String, kayttajaTyyppi: String, organisaatiot: Array[OrganizationPermission])
case class OrganizationPermission(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)

case class Organization(oid: String, nimi: OrganizationName)
case class OrganizationName(fi: Option[String], sv: Option[String], en: Option[String])
