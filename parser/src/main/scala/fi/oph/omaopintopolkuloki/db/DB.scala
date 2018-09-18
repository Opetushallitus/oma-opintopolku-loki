package fi.oph.omaopintopolkuloki.db

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.datamodeling._
import com.amazonaws.services.dynamodbv2.model.{DeleteTableRequest, ProvisionedThroughput}
import fi.oph.omaopintopolkuloki.conf.Configuration._

import scala.annotation.meta.beanGetter
import scala.beans.BeanProperty


object DB {
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

  private def deleteTable() = dynamo.deleteTable(new DeleteTableRequest("AuditLog"))
  def getAllItems: PaginatedScanList[LogEntry] = mapper.scan[LogEntry](classOf[LogEntry], new DynamoDBScanExpression)
}


@DynamoDBTable(tableName="AuditLog")
case class LogEntry(@(DynamoDBHashKey @beanGetter)
                    @BeanProperty var id: String,
                    @BeanProperty var time: String,
                    @BeanProperty var studentOid: String, // Student whose information was being viewed
                    @BeanProperty var organizationOid: java.util.List[String], // List of organizations the viewer belongs to
                    @BeanProperty var raw: String // Raw log entry
                   ) {

  def this() = this(null, null, null, null, null)
}
