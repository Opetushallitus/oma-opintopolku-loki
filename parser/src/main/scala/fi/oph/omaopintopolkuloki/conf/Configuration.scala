package fi.oph.omaopintopolkuloki.conf

import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.secretsmanager.{AWSSecretsManager, AWSSecretsManagerClientBuilder}
import com.amazonaws.services.secretsmanager.model.GetSecretValueRequest
import com.typesafe.config.ConfigFactory
import fi.oph.omaopintopolkuloki.conf.Configuration.{awsRegion, secretsEndpoint, secretsKey}
import org.http4s.Uri
import org.http4s.Uri.{Authority, RegName}
import org.http4s.util.CaseInsensitiveString
import org.json4s.{DefaultFormats, Formats}
import org.json4s.jackson.JsonMethods.parse

import scala.concurrent.duration.{Duration, FiniteDuration}
import scala.language.implicitConversions


object Configuration {
  // We need the classloader to find application.conf within a jar-file, i.e. when running in AWS Lambda
  private lazy val config = ConfigFactory.load(getClass.getClassLoader, "application.conf").resolve

  implicit def toFiniteDuration(d: java.time.Duration): FiniteDuration = Duration.fromNanos(d.toNanos)

  lazy val organization_path: String = config.getString("auditlog.backend.path.organization")
  lazy val permissions_path: String = config.getString("auditlog.backend.path.permissions")

  lazy val baseURI = new Uri(
    scheme = Some(CaseInsensitiveString(config.getString("auditlog.backend.scheme"))),
    authority = Some(Authority(host = RegName(config.getString("auditlog.backend.authority"))))
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

  lazy val secretsEndpoint: String = config.getString("auditlog.secrets.endpoint")
  lazy val secretsKey: String = config.getString("auditlog.secrets.key")
  private lazy val secretsClient: SecretsClient = new SecretsClient
  def getBackendCredentials: Credentials = secretsClient.getCredentials

}

class SecretsClient {
  implicit private val formats: Formats = DefaultFormats

  lazy val secretsManagerClient: AWSSecretsManager = AWSSecretsManagerClientBuilder.standard()
    .withEndpointConfiguration(new EndpointConfiguration(secretsEndpoint, awsRegion)).build()

  def getCredentials: Credentials = parse(
    secretsManagerClient.getSecretValue(new GetSecretValueRequest().withSecretId(secretsKey)).getSecretString
  ).extract[Credentials]
}

case class Credentials(username: String, password: String)
