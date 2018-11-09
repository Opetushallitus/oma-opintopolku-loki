package fi.oph.omaopintopolkuloki

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import fi.oph.omaopintopolkuloki.db.DB
import fi.oph.omaopintopolkuloki.repository.{OrganizationPermission, Permission, RemoteOrganizationRepository, RemoteSQSRepository}
import org.scalamock.scalatest.MockFactory
import org.scalatest.{BeforeAndAfter, FunSpec, Matchers, PrivateMethodTester}
import scalacache.Flags

import scala.io.Source

class LambdaLogParserHandlerTest extends FunSpec with Matchers with MockFactory with PrivateMethodTester with BeforeAndAfter {

  private val sendMessage = PrivateMethod[Unit]('sendMessage)
  private val purgeQueue = PrivateMethod[Unit]('purgeQueue)
  private val createTable = PrivateMethod[Unit]('createTable)
  private val deleteTable = PrivateMethod[Unit]('deleteTable)

  private def purge(): Unit = {
    // Remove all previous entries from SQS
    RemoteSQSRepository invokePrivate purgeQueue()
    // And wait for queue to be empty
    while (RemoteSQSRepository.hasMessages) Thread.sleep(1000)

    // Purge the database
    DB invokePrivate deleteTable()
    DB invokePrivate createTable()
  }

  before { purge() }
  after { purge() }

  describe("LambdaLogParserHandler") {

    it("Should store logs from SQS to database") {

      val katsominenEntry = Source.fromResource("opiskeluoikeus-katsominen-entry.log").mkString
      val healthcheckEntry = Source.fromResource("healthcheck-entry.log").mkString
      val hakuEntry = Source.fromResource("oppija-haku-entry.log").mkString

      val viewerOid = "1.2.345.678.90.11122233344" // same viewer oid as in katsominenEntry
      val studentOid = "1.2.123.456.78.99999999999" // same student oid as in katsominenEntry
      val mockOrganizationOid = "1.2.3"

      val amountOfValidEntries = 5 // create 5 valid entries to the queue

      // First insert non-interesting data to SQS
      RemoteSQSRepository invokePrivate sendMessage(healthcheckEntry) // health checks should not be stored
      RemoteSQSRepository invokePrivate sendMessage(hakuEntry) // search entries should not be stored
      // Then insert some non-parsable data
      RemoteSQSRepository invokePrivate sendMessage("Hello world!") // app should not fail if we encounter random log entries
      // Then insert audit logs we are interested in
      (1 to amountOfValidEntries) foreach(_ => RemoteSQSRepository invokePrivate sendMessage(katsominenEntry))

      // And wait for the items to show up on queue
      while (!RemoteSQSRepository.hasMessages) Thread.sleep(1000)

      val remoteOrganizationRepository: RemoteOrganizationRepository = mock[RemoteOrganizationRepository]
      val mockResponse = List(OrganizationPermission(mockOrganizationOid, List(Permission("ATARU_HAKEMUS", "READ")).toArray)).toArray
      val flags = Flags(readsEnabled = true, writesEnabled = true)

      (remoteOrganizationRepository.getOrganizationIdsForUser(_: String)(_: Flags))
        .expects(viewerOid, flags)
        .returning(mockResponse)
        .repeat(amountOfValidEntries)

      val parser = new LambdaLogParserHandler(remoteOrganizationRepository)
      val result = parser.handleRequest(mock[SQSEvent], mock[Context])

      assert(result.stored == 5, "Stored correct amount of log entries")
      assert(result.skipped == 2, "Skipped entries")
      assert(result.failed == 1, "Non-parsable entries reported as failed")

      val dbEntries = DB.getAllItems
      assert(dbEntries.size() == 1, "No duplicate entries were stored to DB") // All 5 of our valid entries were identical

      val dbEntry = dbEntries.get(0)
      assert(dbEntry.organizationOid.get(0) == mockOrganizationOid, "Correct organization oid was stored to DB")
      assert(dbEntry.studentOid == studentOid, "Correct student oid was stored to DB")
      assert(dbEntry.id == "2018-08-24T13:18:32.667+03;3;", "Correct ID was stored to DB")
      assert(dbEntry.raw.length > 100, "Raw log entry data stored to DB")
    }

    it("Should store logs when student viewed own data") {
      val selfEntry = Source.fromResource("opiskeluoikeus-katsominen-self.log").mkString
      RemoteSQSRepository invokePrivate sendMessage(selfEntry)

      while (!RemoteSQSRepository.hasMessages) Thread.sleep(1000)

      val parser = new LambdaLogParserHandler
      val result = parser.handleRequest(mock[SQSEvent], mock[Context])

      assert(result.stored == 1, "Was able to process self view entry")
      assert(result.skipped == 0, "No skipped entries")
      assert(result.failed == 0, "No failed entries was found")

      val dbEntries = DB.getAllItems
      assert(dbEntries.size() == 1, "Entry was stored to DB") // All 5 of our valid entries were identical

      val dbEntry = dbEntries.get(0)
      assert(dbEntry.organizationOid.get(0) == "self", "Organization is 'self' when user viewed own data")
    }

  }

}
