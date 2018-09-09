package fi.vm.sade

import org.slf4j.LoggerFactory
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import fi.vm.sade.db.{DB, LogEntry}
import fi.vm.sade.log.{Entry, EntryParser}

import scala.collection.JavaConverters._

class LambdaLogParserHandler extends RequestHandler[SQSEvent, Int] {
  private val logger = LoggerFactory.getLogger(this.getClass)

  logger.info("Log parser created")

  protected val sqsRepository: RemoteSQSRepository.type = RemoteSQSRepository
  protected val remoteOrganizationRepository = new RemoteOrganizationRepository

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

    var failureCount = 0

    sqsRepository.getMessages.asScala.foreach(message => {
      try {
        storeLogEntry(EntryParser(message.getBody))
        sqsRepository.deleteMessage(message.getReceiptHandle)
      } catch {
        case t: Throwable => logger.error(s"Failed to process SQS message ${message.getBody}", t) ; failureCount += 1
      }
    })

    failureCount
  }

  private def storeLogEntry(entry: Entry) = {

    if (entry.shouldStore) {
      val studentOid = entry.target.getOrElse(throw new RuntimeException("No student oid found for log entry")).oppijaHenkiloOid
      val viewerOid = entry.user.getOrElse(throw new RuntimeException("No viewer oid found for log entry")).oid

      val viewerOrganizations = remoteOrganizationRepository.
        getOrganizationIdsForUser(viewerOid).map(permission => permission.organisaatioOid).toList

      if(viewerOrganizations.isEmpty) throw new RuntimeException(s"Failed to get organizations for ${viewerOid}")

      DB.save(new LogEntry(
        entry.timestamp,
        studentOid,
        viewerOrganizations
      ))
    } else {
      logger.debug(s"Skipping log entry ${entry.operation.getOrElse(entry.`type`)}")
    }
  }
}
