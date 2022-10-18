package fi.oph.omaopintopolkuloki

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import fi.oph.omaopintopolkuloki.db.{DB, LogEntry}
import fi.oph.omaopintopolkuloki.log.EntryParser
import fi.oph.omaopintopolkuloki.repository.{RemoteOrganizationRepository, RemoteSQSRepository}
import org.slf4j.{LoggerFactory, MDC}

import scala.util.Try
import scala.io.Source
import scala.collection.JavaConverters._

class LambdaLogParserHandler(sqsRepository: RemoteSQSRepository.type, remoteOrganizationRepository: RemoteOrganizationRepository)
  extends RequestHandler[SQSEvent, ProcessResult] {

  private val logger = LoggerFactory.getLogger(this.getClass)

  logger.info("Log parser created, version: " + buildVersion)

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
    logger.info(s"Starting to process SQS queue")

    var failureCount = 0
    var storedCount = 0
    var skippedCount = 0

    do {
      sqsRepository.getMessages.asScala.foreach(message => {
        try {
          val stored = storeLogEntry(message.getBody)
          sqsRepository.deleteMessage(message.getReceiptHandle)
          if (stored) {
            storedCount += 1
          } else {
            skippedCount += 1
          }
        } catch {
          case t: Throwable => logger.error(s"Failed to process SQS message ${message.getBody}", t) ; failureCount += 1
        }
      })
    } while (sqsRepository.hasMessages)
    try {
      MDC.put("storedCount", storedCount.toString)
      MDC.put("skippedCount", skippedCount.toString)
      MDC.put("failureCount", failureCount.toString)
      logger.info(s"Stored ${storedCount} events, skipped ${skippedCount}, failed to process ${failureCount} events")
    } finally {
      MDC.remove("storedCount")
      MDC.remove("skippedCount")
      MDC.remove("failureCount")
    }
    ProcessResult(storedCount, skippedCount, failureCount)
  }

  private def storeLogEntry(entryBody: String): Boolean = {

    val entry = EntryParser(entryBody)

    if (entry.shouldStore) {
      val studentOid = entry.target.getOrElse(throw new RuntimeException("No student oid found for log entry")).oppijaHenkiloOid
      val viewerOid = entry.user.getOrElse(throw new RuntimeException("No viewer oid found for log entry")).oid

      val viewerOrganizations: List[String] = if (studentOid == viewerOid) {
        List("self") // Student has viewed his/her own data
      } else if (entry.operation.contains("KANSALAINEN_HUOLTAJA_OPISKELUOIKEUS_KATSOMINEN")) {
        List("huoltaja")
      } else if (entry.serviceName == "varda") {
        entry.organizationOid.toList
      } else {
        remoteOrganizationRepository.getOrganizationIdsForUser(viewerOid).map(permission => permission.organisaatioOid).toList
      }

      DB.save(new LogEntry(
        entry.getKey,
        entry.timestamp,
        studentOid,
        viewerOrganizations.asJava,
        entryBody
      ))
      true
    } else {
      logger.debug(s"Skipping log entry ${entry.operation.getOrElse(entry.`type`)}")
      false
    }
  }

  private lazy val buildVersion: String = Try(Source.fromResource("buildversion.txt").getLines.mkString(", ")).getOrElse("unknown")
}

case class ProcessResult(stored: Int, skipped: Int, failed: Int)
