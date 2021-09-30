package fi.oph.omaopintopolkuloki.repository

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import com.google.common.cache.CacheBuilder
import fi.oph.omaopintopolkuloki.conf.Configuration._
import fi.oph.omaopintopolkuloki.http.{Http, HttpClient}
import org.http4s.{Query, Request, Uri}
import org.json4s._
import org.json4s.jackson.JsonMethods.parse
import scalacache._
import scalacache.guava._
import scalacache.memoization._
import scalacache.modes.sync._

import scala.language.implicitConversions

class RemoteOrganizationRepository {
  implicit val runtime: IORuntime = cats.effect.unsafe.IORuntime.global

  implicit def toQuery(params: Map[String, String]): Query = Query.fromMap(params.map{ case (k,v) => (k, Seq(v)) })

  implicit private val formats: Formats = DefaultFormats

  private val underlyingPermissionCache = CacheBuilder.newBuilder().maximumSize(cacheSize).build[String, Entry[Array[OrganizationPermission]]]
  implicit private val permissionCache: Cache[Array[OrganizationPermission]] = GuavaCache(underlyingPermissionCache)

  private val underlyingOrganizationCache = CacheBuilder.newBuilder().maximumSize(cacheSize).build[String, Entry[Array[Organization]]]
  implicit private val organizationCache: Cache[Array[Organization]] = GuavaCache(underlyingOrganizationCache)

  private def organizationURL(oid: String): Uri = baseURI.copy(
    path = Uri.Path.unsafeFromString(organization_path + oid),
    query = Map("includeImage" -> "false")
  )
  private def permissionURL(oid: String): Uri = baseURI.copy(
    path = Uri.Path.unsafeFromString(permissions_path),
    query = Map("oidHenkilo" -> oid)
  )

  protected lazy val casHttpClient: HttpClient = Http(useCas = true)
  protected lazy val httpClient: HttpClient = Http()

  def getOrganizationIdsForUser(oid: String)(implicit flags: Flags): Array[OrganizationPermission] = memoizeSync(Some(cacheTTL)) {

    val users: Array[User] =
      casHttpClient
        .get(permissionURL(oid))(parseResponse[Array[User]])
        .timeout(requestTimeout)
        .unsafeRunSync()

    users.flatMap(user => user.organisaatiot)
  }

  def getOrganizationsForUser(oid: String)(implicit flags: Flags): Array[Organization] = memoizeSync(Some(cacheTTL)) {

    val organizations = getOrganizationIdsForUser(oid)

    organizations.map(org =>
      httpClient
        .get(organizationURL(org.organisaatioOid))(parseResponse[Organization])
        .timeout(requestTimeout)
        .unsafeRunSync()
    )
  }

  private def parseResponse[T](status: Int, body: String, request: Request[IO])(implicit m: Manifest[T]): T = {
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
