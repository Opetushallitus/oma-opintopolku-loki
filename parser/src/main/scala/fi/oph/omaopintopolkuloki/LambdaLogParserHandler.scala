package fi.oph.omaopintopolkuloki

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.amazonaws.services.sqs.model.Message
import fi.oph.omaopintopolkuloki.conf.Configuration
import fi.oph.omaopintopolkuloki.db.{DB, LogEntry}
import fi.oph.omaopintopolkuloki.log.EntryParser
import fi.oph.omaopintopolkuloki.repository.{RemoteOrganizationRepository, RemoteSQSRepository}
import org.slf4j.{LoggerFactory, MDC}

import scala.util.Try
import scala.io.Source
import scala.jdk.CollectionConverters._

class LambdaLogParserHandler(
  sqsRepository: RemoteSQSRepository.type,
  remoteOrganizationRepository: RemoteOrganizationRepository,
  organizationLookupCutoff: String = Configuration.organizationLookupCutoff
) extends RequestHandler[SQSEvent, ProcessResult] {

  private val logger = LoggerFactory.getLogger(this.getClass)

  private val unknownOrganization = "tuntematon"

  private val timeReserveMillis = Configuration.requestTimeout.toMillis * 2

  private def hasTimeLeft(context: Context): Boolean = context.getRemainingTimeInMillis > timeReserveMillis

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
    * @return Counts of processed events, with stoppedEarly set if the time budget ran out before the queue was drained
    */
  def handleRequest(sqsEvent: SQSEvent, context: Context): ProcessResult = {
    logger.info(s"Starting to process SQS queue")

    var failureCount = 0
    var storedCount = 0
    var skippedCount = 0
    var timeLeft = true

    do {
      val prepared = sqsRepository.getMessages.asScala.iterator
        .takeWhile(_ => hasTimeLeft(context))
        .map(prepareMessage)
        .toList

      val storable = prepared.collect { case s: Storable => s }
      val skippable = prepared.collect { case Skippable(message) => message }

      skippedCount += skippable.size
      failureCount += prepared.count(_ == Unprocessable)

      val failedBatches = if (storable.isEmpty) Nil else DB.saveAll(distinctEntries(storable))

      if (failedBatches.isEmpty) {
        storedCount += storable.size
        sqsRepository.deleteMessages(skippable ++ storable.map(_.message))
      } else {
        failedBatches.foreach(batch =>
          logger.error(s"Failed to store a batch of ${storable.size} log entries, they will be redelivered", batch.getException))
        failureCount += storable.size
        sqsRepository.deleteMessages(skippable)
      }

      timeLeft = hasTimeLeft(context)
    } while (timeLeft && sqsRepository.hasMessages)
    try {
      MDC.put("storedCount", storedCount.toString)
      MDC.put("skippedCount", skippedCount.toString)
      MDC.put("failureCount", failureCount.toString)
      MDC.put("stoppedEarly", (!timeLeft).toString)
      logger.info(s"Stored ${storedCount} events, skipped ${skippedCount}, failed to process ${failureCount} events" +
        (if (timeLeft) "" else ", stopped early to avoid timeout"))
    } finally {
      MDC.remove("storedCount")
      MDC.remove("skippedCount")
      MDC.remove("failureCount")
      MDC.remove("stoppedEarly")
    }
    ProcessResult(storedCount, skippedCount, failureCount, !timeLeft)
  }

  private def prepareMessage(message: Message): PreparedMessage =
    try {
      prepareLogEntry(message.getBody) match {
        case Some(logEntry) => Storable(message, logEntry)
        case None => Skippable(message)
      }
    } catch {
      case t: Throwable =>
        logger.error(s"Failed to process SQS message ${message.getBody}", t)
        Unprocessable
    }

  // BatchWriteItem rejects a request containing the same key twice
  private def distinctEntries(storable: List[Storable]): Seq[LogEntry] =
    storable.map(_.logEntry).groupBy(logEntry => (logEntry.studentOid, logEntry.id)).values.map(_.head).toSeq

  private def prepareLogEntry(entryBody: String): Option[LogEntry] = {

    val entry = EntryParser(entryBody)

    if (entry.shouldStore) {
      val studentOid = entry.studentOid.getOrElse(throw new RuntimeException("No student oid found for log entry"))
      val viewerOid = entry.user.getOrElse(throw new RuntimeException("No viewer oid found for log entry")).oid

      val viewerOrganizations: List[String] = if (studentOid == viewerOid) {
        List("self") // Student has viewed his/her own data
      } else if (entry.operation.contains("KANSALAINEN_HUOLTAJA_OPISKELUOIKEUS_KATSOMINEN")) {
        List("huoltaja")
      } else if (entry.serviceName == "varda") {
        entry.organizationOid.toList
      } else if (entry.serviceName == "kitu") {
        entry.organizationOid.toList
      } else if (entry.serviceName == "koski" && entry.timestamp < organizationLookupCutoff) {
        List(unknownOrganization)
      } else {
        remoteOrganizationRepository.getOrganizationIdsForUser(viewerOid).map(permission => permission.organisaatioOid).toList
      }

      Some(new LogEntry(
        entry.getKey,
        entry.timestamp,
        studentOid,
        viewerOrganizations.asJava,
        entryBody
      ))
    } else {
      logger.debug(s"Skipping log entry ${entry.operation.getOrElse(entry.`type`)}")
      None
    }
  }

  private lazy val buildVersion: String = Try(Source.fromResource("buildversion.txt").getLines().mkString(", ")).getOrElse("unknown")
}

case class ProcessResult(stored: Int, skipped: Int, failed: Int, stoppedEarly: Boolean)

private sealed trait PreparedMessage
private case class Storable(message: Message, logEntry: LogEntry) extends PreparedMessage
private case class Skippable(message: Message) extends PreparedMessage
private case object Unprocessable extends PreparedMessage
