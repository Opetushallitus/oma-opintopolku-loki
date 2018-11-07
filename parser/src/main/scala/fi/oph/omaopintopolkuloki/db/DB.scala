package fi.oph.omaopintopolkuloki.db

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.datamodeling._
import com.amazonaws.services.dynamodbv2.model.{DeleteTableRequest, ProvisionedThroughput, ResourceNotFoundException}
import fi.oph.omaopintopolkuloki.conf.Configuration._
import org.slf4j.LoggerFactory

import scala.annotation.meta.beanGetter
import scala.beans.BeanProperty


object DB {
  private val logger = LoggerFactory.getLogger(this.getClass)

  private def endpointConfiguration: EndpointConfiguration = new AwsClientBuilder.EndpointConfiguration(dbHost, awsRegion)

  private lazy val dynamo =
    AmazonDynamoDBClientBuilder.standard()
      .withEndpointConfiguration(endpointConfiguration)
      .build()

  private lazy val mapper = new DynamoDBMapper(dynamo)

  def save(logEntry: LogEntry): Unit = mapper.save(logEntry)

  // Methods for facilitating testing
  private def createTable = {
    val req = mapper.generateCreateTableRequest(classOf[LogEntry])
    req.setProvisionedThroughput(new ProvisionedThroughput(5L, 5L))
    dynamo.createTable(req)
  }

  private def deleteTable() = {
    if (!dbHost.contains("localhost")) throw new RuntimeException(s"Will not delete remote database $dbHost")

    try {
      dynamo.deleteTable(new DeleteTableRequest("AuditLog"))
    } catch {
      case e: ResourceNotFoundException => {
        logger.info("Attempted to delete table AuditLog, but it did not exist.")
      }
    }
  }
  def getAllItems: PaginatedScanList[LogEntry] = mapper.scan[LogEntry](classOf[LogEntry], new DynamoDBScanExpression)
}


@DynamoDBTable(tableName="AuditLog")
case class LogEntry(
                    @(DynamoDBRangeKey @beanGetter) @BeanProperty var id: String,
                    @BeanProperty var time: String,
                    @(DynamoDBHashKey @beanGetter)  @BeanProperty var studentOid: String, // Student whose information was being viewed
                    @BeanProperty var organizationOid: java.util.List[String], // List of organizations the viewer belongs to
                    @BeanProperty var raw: String // Raw log entry
                   ) {

  def this() = this(null, null, null, null, null)
}
