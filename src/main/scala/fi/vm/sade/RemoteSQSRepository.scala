package fi.vm.sade

import java.util

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration
import com.amazonaws.services.sqs.model.{DeleteMessageRequest, DeleteMessageResult, Message}
import com.amazonaws.services.sqs.AmazonSQSClientBuilder
import fi.vm.sade.conf.Configuration._

object RemoteSQSRepository {

  private def endpointConfiguration: EndpointConfiguration = new AwsClientBuilder.EndpointConfiguration(SQSHost, awsRegion)

  private val sqs = AmazonSQSClientBuilder.standard().withEndpointConfiguration(endpointConfiguration).build()
  private val queueUrl: String = sqs.getQueueUrl(SQSQueueName).getQueueUrl

  def getMessages: util.List[Message] = {
    sqs.receiveMessage(queueUrl).getMessages
  }

  def deleteMessage(receiptHandle: String): DeleteMessageResult = {
    sqs.deleteMessage(new DeleteMessageRequest(queueUrl, receiptHandle))
  }
}
