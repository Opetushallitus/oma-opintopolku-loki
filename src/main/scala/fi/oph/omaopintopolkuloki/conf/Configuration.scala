package fi.oph.omaopintopolkuloki.conf

import com.typesafe.config.ConfigFactory
import org.http4s.Uri
import org.http4s.Uri.{Authority, RegName}
import org.http4s.util.CaseInsensitiveString

import scala.concurrent.duration.{Duration, FiniteDuration}
import scala.language.implicitConversions

object Configuration {
  private lazy val config = ConfigFactory.load

  implicit def toFiniteDuration(d: java.time.Duration): FiniteDuration = Duration.fromNanos(d.toNanos)

  lazy val organization_path: String = config.getString("auditlog.backend.path.organization")
  lazy val permissions_path: String = config.getString("auditlog.backend.path.permissions")

  lazy val baseURI = new Uri(
    scheme = Some(CaseInsensitiveString(config.getString("auditlog.backend.scheme"))),
    authority = Some(Authority(host = RegName(config.getString("auditlog.backend.authority")))),
  )

  lazy val cacheHost: String = config.getString("auditlog.cache.host")
  lazy val cachePort: Int = config.getInt("auditlog.cache.port")
  lazy val cacheTTL: Duration = config.getDuration("auditlog.cache.ttl")

  lazy val maxRequestThreads: Int = config.getInt("auditlog.http.maxRequestThreads")
  lazy val requestTimeout: Duration = config.getDuration("auditlog.http.timeout")

  lazy val awsRegion: String = config.getString("auditlog.aws.region")

  lazy val dbHost: String = config.getString("auditlog.db.host")

  lazy val SQSHost: String = config.getString("auditlog.sqs.host")
  lazy val SQSQueueName: String = config.getString("auditlog.sqs.queuename")
}
