package fi.oph.omaopintopolkuloki.repository

import fi.oph.omaopintopolkuloki.conf.Configuration._
import fi.oph.omaopintopolkuloki.http.Http
import org.http4s.{Query, Request, Uri}
import org.json4s._
import org.json4s.jackson.JsonMethods.parse
import org.slf4j.LoggerFactory
import scalacache._
import scalacache.memoization._
import scalacache.modes.sync._
import scalacache.redis._
import scalacache.serialization.binary._

import scala.language.implicitConversions

class RemoteOrganizationRepository {

  implicit def toQuery(params: Map[String, String]): Query = Query.fromMap(params.map{ case (k,v) => (k, Seq(v)) })

  implicit private val permissionCache: Cache[Array[OrganizationPermission]] = RedisCache(cacheHost, cachePort)
  implicit private val organizationCache: Cache[Array[Organization]] = RedisCache(cacheHost, cachePort)
  implicit private val formats: Formats = DefaultFormats

  private def organizationURL(oid: String): Uri = baseURI.copy(path = organization_path + oid, query = Map("includeImage" -> "false"))
  private def permissionURL(oid: String): Uri = baseURI.copy(path = permissions_path, query = Map("oidHenkilo" -> oid))

  protected lazy val casHttpClient = Http(useCas = true)
  protected lazy val httpClient = Http()

  private val logger = LoggerFactory.getLogger(this.getClass)

  def getOrganizationIdsForUser(oid: String)(implicit flags: Flags): Array[OrganizationPermission] = memoizeSync(Some(cacheTTL)) {

    val users: Array[User] = casHttpClient.get(permissionURL(oid))(parseResponse[Array[User]])
       .runFor(requestTimeout)

    users.flatMap(user => user.organisaatiot)
  }

  def getOrganizationsForUser(oid: String)(implicit flags: Flags): Array[Organization] = memoizeSync(Some(cacheTTL)) {

    val organizations = getOrganizationIdsForUser(oid)

    organizations.map(org => httpClient.get(organizationURL(org.organisaatioOid))(parseResponse[Organization])
      .runFor(requestTimeout)
    )
  }

  private def parseResponse[T](status: Int, body: String, request: Request)(implicit m: Manifest[T]): T = {
    if (status != 200) {
      throw new RuntimeException(s"Request ${request.uri.renderString} failed with with status ${status}: ${body.take(40)}")
    }

    parse(body).extract[T]
  }
}


case class User(oidHenkilo: String, username: Option[String], kayttajaTyyppi: Option[String], organisaatiot: Array[OrganizationPermission])
case class OrganizationPermission(organisaatioOid: String, kayttooikeudet: Array[Permission])
case class Permission(palvelu: String, oikeus: String)

case class Organization(oid: String, nimi: OrganizationName)
case class OrganizationName(fi: Option[String], sv: Option[String], en: Option[String])
