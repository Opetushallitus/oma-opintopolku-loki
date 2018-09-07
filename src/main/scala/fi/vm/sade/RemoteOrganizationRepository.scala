package fi.vm.sade

import org.http4s.{Query, Request, Uri}
import org.json4s._
import org.json4s.jackson.JsonMethods._
import fi.vm.sade.http.Http
import scalacache._
import scalacache.redis._
import scalacache.serialization.binary._
import scalacache.modes.sync._
import fi.vm.sade.conf.Configuration._
import scalacache.memoization._

class RemoteOrganizationRepository {

  implicit def toQuery(params: Map[String, String]): Query = Query.fromMap(params.map{ case (k,v) => (k, Seq(v)) })

  implicit val permissionCache: Cache[Array[OrganizationPermission]] = RedisCache(cacheHost, cachePort)
  implicit val organizationCache: Cache[Array[Organization]] = RedisCache(cacheHost, cachePort)
  implicit val formats: Formats = DefaultFormats

  private def organizationURL(oid: String): Uri = baseURI.copy(path = organization_path + oid, query = Map("includeImage" -> "false"))
  private def permissionURL(oid: String): Uri = baseURI.copy(path = permissions_path, query = Map("oidHenkilo" -> oid))

  def getOrganizationIdsForUser(oid: String): Array[OrganizationPermission] = memoizeSync(Some(cacheTTL)) {

    val httpClient = Http(useCas = true)
    val users: Array[User] = httpClient.get(permissionURL(oid))(parseResponse[Array[User]])
       .runFor(requestTimeout)

    users.flatMap(user => user.organisaatiot)
  }

  def getOrganizationsForUser(oid: String): Array[Organization] = memoizeSync(Some(cacheTTL)) {

    val httpClient = Http()
    val organizations = getOrganizationIdsForUser(oid)

    organizations.map(org => httpClient.get(organizationURL(org.organisaatioOid))(parseResponse[Organization])
      .runFor(requestTimeout)
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
