package fi.vm.sade

import java.util.Date

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.datamodeling.{DynamoDBHashKey, DynamoDBMapper, DynamoDBTable}
import org.slf4j.LoggerFactory
import com.amazonaws.services.dynamodbv2.{AmazonDynamoDB, AmazonDynamoDBClient, AmazonDynamoDBClientBuilder}
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientConfigurationFactory

import scala.annotation.meta.beanGetter
import scala.beans.BeanProperty

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput


/**
 * @author ${user.name}
 */
object App {

  val logger = LoggerFactory.getLogger(this.getClass)

  val heikki_testaa = "1.2.246.562.24.36742098962"
  val auditlog = "1.2.246.562.24.27696726056"

  val dynamo =
  AmazonDynamoDBClientBuilder.standard()
    .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("http://localhost:8000", Regions.EU_WEST_1.getName))
    .build()

  val mapper = new DynamoDBMapper(dynamo)

  def createTable = {
    val req = mapper.generateCreateTableRequest(classOf[LogEntry])
    req.setProvisionedThroughput(new ProvisionedThroughput(5L, 5L))
    dynamo.createTable(req)
  }

  def main(args : Array[String]) {
    def repository = new RemoteOrganizationRepository()

    createTable

    logger.info("Application started")

    val organisaatiot = repository.getOrganizationIdsForUser(heikki_testaa)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

    val organizations = repository.getOrganizationsForUser(heikki_testaa)

    organizations.map(o => {
      val entry: LogEntry = new LogEntry(new Date(), "123", o.oid)
      mapper.save(entry)
      println(o.nimi.fi.get)
    })

  }
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
