package fi.vm.sade.db

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.datamodeling.{DynamoDBHashKey, DynamoDBMapper, DynamoDBTable}
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput
import fi.vm.sade.conf.Configuration._

import scala.annotation.meta.beanGetter
import scala.beans.BeanProperty


object DB {
  private def endpointConfiguration: EndpointConfiguration = new AwsClientBuilder.EndpointConfiguration(dbHost, awsRegion)

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

  def save(logEntry: LogEntry): Unit = { println(s"Saving item: ${logEntry}") ;mapper.save(logEntry)  }
}


@DynamoDBTable(tableName="LogEntry")
case class LogEntry(@(DynamoDBHashKey @beanGetter)
                    @BeanProperty var id: String,
                    @BeanProperty var time: String,
                    @BeanProperty var studentOid: String, // Student whose information was being viewed
                    @BeanProperty var organizationOid: java.util.List[String] // List of organizations the viewer belongs to
                   ) {

  def this() = this(null, null, null, null)

  def this(time: String, studentOid: String, organizationOid: java.util.List[String]) = this(
    time + ";" + studentOid + ";" + organizationOid.toString(),
    time,
    studentOid,
    organizationOid
  )
}
