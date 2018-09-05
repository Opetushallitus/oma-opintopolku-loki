package fi.vm.sade

import org.http4s.{Request}
import org.http4s.client.{blaze}
import org.json4s._
import org.json4s.jackson.JsonMethods._
import Configuration._

class RemoteOrganizationRepository {

  implicit val formats: Formats = DefaultFormats

  val blazeHttpClient = blaze.PooledHttp1Client(maxTotalConnections = maxHttpRequestThreads)

  def getOrganizationIdsForUser(oid: String): Array[OrganizationPermission] = {

    val permissionClient = Http(CasHttpClient(blazeHttpClient, Configuration.scheme_authority))
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


case class User(oidHenkilo: String, username: String, kayttajaTyyppi: String, organisaatiot: Array[OrganizationPermission])
case class OrganizationPermission(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)

case class Organization(oid: String, nimi: OrganizationName)
case class OrganizationName(fi: Option[String], sv: Option[String], en: Option[String])
