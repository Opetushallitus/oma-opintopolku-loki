package fi.vm.sade.repository

import java.util

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.sqs.{AmazonSQS, AmazonSQSClientBuilder}
import com.amazonaws.services.sqs.model._
import fi.vm.sade.conf.Configuration._
import scala.collection.JavaConverters._
import com.amazonaws.services.sqs.model.ReceiveMessageRequest

object RemoteSQSRepository {

  private def endpointConfiguration: EndpointConfiguration = new AwsClientBuilder.EndpointConfiguration(SQSHost, awsRegion)

  private val sqs: AmazonSQS = AmazonSQSClientBuilder.standard().withEndpointConfiguration(endpointConfiguration).build()
  private val queueUrl: String = sqs.getQueueUrl(SQSQueueName).getQueueUrl

  private val approximateNumberOfMessages = QueueAttributeName.ApproximateNumberOfMessages.toString

  def getMessages: util.List[Message] = {
    sqs.receiveMessage(new ReceiveMessageRequest(queueUrl).withMaxNumberOfMessages(10)).getMessages
  }

  def deleteMessage(receiptHandle: String): DeleteMessageResult = {
    sqs.deleteMessage(new DeleteMessageRequest(queueUrl, receiptHandle))
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
