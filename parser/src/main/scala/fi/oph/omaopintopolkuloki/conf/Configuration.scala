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
import org.slf4j.LoggerFactory

import scala.concurrent.duration.{Duration, FiniteDuration}
import scala.language.implicitConversions


object Configuration {

  private val logger = LoggerFactory.getLogger(this.getClass)

  logger.info(s"Initializing configurations for environment $env")

  private lazy val env: String = sys.env.getOrElse("env", "local")

  // We need the classloader to find application.conf within a jar-file, i.e. when running in AWS Lambda
  private lazy val config = ConfigFactory.load(getClass.getClassLoader, env).resolve

  implicit def toFiniteDuration(d: java.time.Duration): FiniteDuration = Duration.fromNanos(d.toNanos)

  lazy val organization_path: String = config.getString("auditlog.backend.path.organization")
  lazy val permissions_path: String = config.getString("auditlog.backend.path.permissions")

  lazy val baseURI = new Uri(
    scheme = Some(CaseInsensitiveString(config.getString("auditlog.backend.scheme"))),
    authority = Some(Authority(host = RegName(config.getString("auditlog.backend.authority"))))
  )

  lazy val cacheSize: Int = config.getInt("auditlog.cache.size")
  lazy val cacheTTL: Duration = config.getDuration("auditlog.cache.ttl")

  lazy val maxRequestThreads: Int = config.getInt("auditlog.http.maxRequestThreads")
  lazy val requestTimeout: Duration = config.getDuration("auditlog.http.timeout")

  lazy val awsRegion: String = config.getString("auditlog.aws.region")

  lazy val dbHost: String = config.getString("auditlog.db.host")

  lazy val SQSHost: String = if (config.hasPath("auditlog.sqs.host")) {
    config.getString("auditlog.sqs.host")
  } else {
    s"https://sqs.${awsRegion}.amazonaws.com/${accountId}"
  }

  lazy val SQSQueueName: String = config.getString("auditlog.sqs.queuename")

  lazy val secretsEndpoint: String = config.getString("auditlog.secrets.endpoint")
  lazy val secretsKey: String = config.getString("auditlog.secrets.key")
  private lazy val secretsClient: SecretsClient = new SecretsClient
  def getSecrets: Credentials = secretsClient.getSecrets
  lazy val accountId: String = getSecrets.accountId

}

class SecretsClient {
  implicit private val formats: Formats = DefaultFormats
  private val logger = LoggerFactory.getLogger(this.getClass)

  logger.info(s"Using secret $secretsKey from ${endpointConfiguration.getServiceEndpoint}")

  lazy val endpointConfiguration: EndpointConfiguration = new EndpointConfiguration(secretsEndpoint, awsRegion)

  lazy val secretsManagerClient: AWSSecretsManager = AWSSecretsManagerClientBuilder.standard()
    .withEndpointConfiguration(endpointConfiguration).build()

  def getSecrets: Credentials = parse(
    secretsManagerClient.getSecretValue(new GetSecretValueRequest().withSecretId(secretsKey)).getSecretString
  ).extract[Credentials]
}

case class Credentials(accountId: String, username: String, password: String)
