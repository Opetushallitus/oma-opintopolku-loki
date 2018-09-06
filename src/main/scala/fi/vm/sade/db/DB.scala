package fi.vm.sade.db

import java.util.Date

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.datamodeling.{DynamoDBHashKey, DynamoDBMapper, DynamoDBTable}
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput
import com.typesafe.config.Config

import scala.annotation.meta.beanGetter
import scala.beans.BeanProperty


object DB {
  var config: Option[Config] = None

  def apply(_config: Config) = {
    if (config.isEmpty) config = Some(_config)
    this
  }

  private def endpointConfiguration: EndpointConfiguration = {
    if (config.isEmpty) throw new RuntimeException("Database needs to be configured before being used")

    new AwsClientBuilder.EndpointConfiguration(
      config.get.getString("auditlog.db.host"),
      config.get.getString("auditlog.db.region")
    )
  }

  private lazy val dynamo =
    AmazonDynamoDBClientBuilder.standard()
      .withEndpointConfiguration(endpointConfiguration)
      .build()

  private lazy val mapper = new DynamoDBMapper(dynamo)

  private def createTable = { // you can use this to create a local table if you wish
    val req = mapper.generateCreateTableRequest(classOf[LogEntry])
    req.setProvisionedThroughput(new ProvisionedThroughput(5L, 5L))
    dynamo.createTable(req)
  }

  def save(logEntry: LogEntry): Unit = mapper.save(logEntry)
}


@DynamoDBTable(tableName="LogEntry")
case class LogEntry(  @(DynamoDBHashKey @beanGetter)
                      @BeanProperty var id: String,
                      @BeanProperty var time: Date,
                      @BeanProperty var userOid: String,
                      @BeanProperty var organizationOid: String
                   ) {

  def this() = this(null, null, null, null)

  def this(time: Date, userOid: String, organizationOid: String) = this(
    time.getTime + userOid + organizationOid,
    time,
    userOid,
    organizationOid
  )
}
