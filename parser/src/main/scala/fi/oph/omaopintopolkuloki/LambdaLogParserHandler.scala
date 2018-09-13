package fi.oph.omaopintopolkuloki

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import fi.oph.omaopintopolkuloki.db.{DB, LogEntry}
import fi.oph.omaopintopolkuloki.log.EntryParser
import fi.oph.omaopintopolkuloki.repository.{RemoteOrganizationRepository, RemoteSQSRepository}
import org.slf4j.LoggerFactory

import scala.collection.JavaConverters._

class LambdaLogParserHandler(sqsRepository: RemoteSQSRepository.type, remoteOrganizationRepository: RemoteOrganizationRepository)
  extends RequestHandler[SQSEvent, ProcessResult] {

  private val logger = LoggerFactory.getLogger(this.getClass)

  logger.info("Log parser created")

  def this(remoteOrganizationRepository: RemoteOrganizationRepository) = this(RemoteSQSRepository, remoteOrganizationRepository)
  def this() = this(RemoteSQSRepository, new RemoteOrganizationRepository)

  /**
    * Code execution starting point, called by AWS Lambda when new log entries have been stored to Cloudwatch & SQS.
    * The received SQS events are only used to trigger this method and then discarded, the entire SQS queue
    * is read and processed after the function has been triggered.
    *
    * @param sqsEvent Triggering events
    * @param context Triggering context
    * @return 0 if whole SQS queue was processed or != 0 otherwise
    */
  def handleRequest(sqsEvent: SQSEvent, context: Context): ProcessResult = {
    logger.info(s"Received SQS event")

    var failureCount = 0
    var successCount = 0

    do {
      sqsRepository.getMessages.asScala.foreach(message => {
        try {
          storeLogEntry(message.getBody)
          sqsRepository.deleteMessage(message.getReceiptHandle)
          successCount += 1
        } catch {
          case t: Throwable => logger.error(s"Failed to process SQS message ${message.getBody}", t) ; failureCount += 1
        }
      })
    } while (sqsRepository.hasMessages)

    ProcessResult(successCount, failureCount)
  }

  private def storeLogEntry(entryBody: String) = {

    val entry = EntryParser(entryBody)

    if (entry.shouldStore) {
      val studentOid = entry.target.getOrElse(throw new RuntimeException("No student oid found for log entry")).oppijaHenkiloOid
      val viewerOid = entry.user.getOrElse(throw new RuntimeException("No viewer oid found for log entry")).oid

      val viewerOrganizations = remoteOrganizationRepository.
        getOrganizationIdsForUser(viewerOid).map(permission => permission.organisaatioOid).toList

      if(viewerOrganizations.isEmpty) throw new RuntimeException(s"Failed to get organizations for ${viewerOid}")

      DB.save(LogEntry(
        entry.getKey,
        entry.timestamp,
        studentOid,
        viewerOrganizations.asJava,
        entryBody
      ))
    } else {
      logger.debug(s"Skipping log entry ${entry.operation.getOrElse(entry.`type`)}")
    }
  }
}

case class ProcessResult(success: Int, failed: Int)
