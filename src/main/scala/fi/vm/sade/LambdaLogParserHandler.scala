package fi.vm.sade

import org.slf4j.LoggerFactory
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import fi.vm.sade.db.{DB, LogEntry}
import fi.vm.sade.log.EntryParser
import org.slf4j.Marker
import org.slf4j.MarkerFactory

import scala.collection.JavaConverters._

class LambdaLogParserHandler extends RequestHandler[SQSEvent, Int] {
  private val logger = LoggerFactory.getLogger(this.getClass)
  private val fatal: Marker = MarkerFactory.getMarker("FATAL")

  logger.info("Log parser created")


  /**
    * Code execution starting point, called by AWS Lambda when new log entries have been stored to Cloudwatch & SQS.
    * The received SQS events are only used to trigger this method and then discarded, the entire SQS queue
    * is read and processed after the function has been triggered.
    *
    * @param sqsEvent Triggering events
    * @param context Triggering context
    * @return 0 if whole SQS queue was processed or != 0 otherwise
    */
  def handleRequest(sqsEvent: SQSEvent, context: Context): Int = {
    logger.info(s"Received SQS event")

    try {
      var failureCount = 0
      val sqsRepository = RemoteSQSRepository
      val remoteOrganizationRepository = new RemoteOrganizationRepository

      sqsRepository.getMessages.asScala.foreach(message => {
        try {
          val logMessage = EntryParser(message.getBody)

          if (logMessage.shouldStore) {
            val studentOid = logMessage.target.getOrElse(throw new RuntimeException("No valid student oid for log entry")).oppijaHenkiloOid
            val viewerOid = logMessage.user.getOrElse(throw new RuntimeException("No valid viewer oid for log entry")).oid

            val viewerOrganizations = remoteOrganizationRepository.
              getOrganizationIdsForUser(viewerOid).map(permission => permission.organisaatioOid).toList

            DB.save(new LogEntry(
              logMessage.timestamp,
              studentOid,
              viewerOrganizations
            ))
          } else {
            logger.debug(s"Skipping log entry ${logMessage.operation.getOrElse(logMessage.`type`)}")
          }

          sqsRepository.deleteMessage(message.getReceiptHandle)
        } catch {
          case t: Throwable => logger.error(s"Failed to process SQS message ${message.getBody}", t) ; failureCount += 1
        }
      })


      failureCount
    } catch {
      case t: Throwable => logger.error(fatal, "Failed to parse SQS events", t) ; -1
    }
  }
}
