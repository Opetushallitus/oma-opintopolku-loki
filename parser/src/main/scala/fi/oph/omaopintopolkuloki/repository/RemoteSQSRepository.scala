package fi.oph.omaopintopolkuloki.repository

import java.util

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.sqs.{AmazonSQS, AmazonSQSClientBuilder}
import com.amazonaws.services.sqs.model._
import fi.oph.omaopintopolkuloki.conf.Configuration._
import org.slf4j.LoggerFactory

import scala.jdk.CollectionConverters._
import com.amazonaws.services.sqs.model.ReceiveMessageRequest

object RemoteSQSRepository {

  private val logger = LoggerFactory.getLogger(this.getClass)

  private def endpointConfiguration: EndpointConfiguration = new AwsClientBuilder.EndpointConfiguration(SQSHost, awsRegion)

  private val sqs: AmazonSQS = AmazonSQSClientBuilder.standard().withEndpointConfiguration(endpointConfiguration).build()
  private val queueUrl: String = sqs.getQueueUrl(SQSQueueName).getQueueUrl

  private val approximateNumberOfMessages = QueueAttributeName.ApproximateNumberOfMessages.toString

  def getMessages: util.List[Message] = {
    sqs.receiveMessage(new ReceiveMessageRequest(queueUrl).withMaxNumberOfMessages(10)).getMessages
  }

  def deleteMessages(messages: Seq[Message]): Unit = {
    messages.grouped(10).foreach(batch => {
      val entries = batch.zipWithIndex.map {
        case (message, index) => new DeleteMessageBatchRequestEntry(index.toString, message.getReceiptHandle)
      }
      val failed = sqs.deleteMessageBatch(queueUrl, entries.asJava).getFailed.asScala
      if (failed.nonEmpty) {
        logger.warn(s"Failed to delete ${failed.size} messages from SQS, they will be redelivered")
      }
    })
  }

  def hasMessages: Boolean = getApproximateNumberOfMessages > 0

  def getApproximateNumberOfMessages: Int = {
    sqs.getQueueAttributes(queueUrl, List(approximateNumberOfMessages).asJava)
      .getAttributes.get(approximateNumberOfMessages).toInt
  }

  // Methods for facilitating testing
  private def sendMessage(message: String) = sqs.sendMessage(new SendMessageRequest(queueUrl, message))
  private def purgeQueue = sqs.purgeQueue(new PurgeQueueRequest(queueUrl))

}
