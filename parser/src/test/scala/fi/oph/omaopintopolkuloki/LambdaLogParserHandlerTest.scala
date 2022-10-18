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
      val vardaEntry = Source.fromResource("varda-log-entry.log").mkString

      val viewerOid = "1.2.345.678.90.11122233344" // same viewer oid as in katsominenEntry
      val studentOid = "1.2.123.456.78.99999999999" // same student oid as in katsominenEntry
      val mockOrganizationOid = "1.2.3"

      val amountOfValidKoskiEntries = 5 // create 5 valid entries to the queue

      // First insert non-interesting data to SQS
      RemoteSQSRepository invokePrivate sendMessage(healthcheckEntry) // health checks should not be stored
      RemoteSQSRepository invokePrivate sendMessage(hakuEntry) // search entries should not be stored
      // Then insert some non-parsable data
      RemoteSQSRepository invokePrivate sendMessage("Hello world!") // app should not fail if we encounter random log entries
      // Then insert audit logs we are interested in
      (1 to amountOfValidKoskiEntries) foreach(_ => RemoteSQSRepository invokePrivate sendMessage(katsominenEntry))
      // Then insert Varda audit log
      RemoteSQSRepository invokePrivate sendMessage(vardaEntry)

      // And wait for the items to show up on queue
      while (!RemoteSQSRepository.hasMessages) Thread.sleep(1000)

      val remoteOrganizationRepository: RemoteOrganizationRepository = mock[RemoteOrganizationRepository]
      val mockResponse = List(OrganizationPermission(mockOrganizationOid, List(Permission("ATARU_HAKEMUS", "READ")).toArray)).toArray
      val flags = Flags(readsEnabled = true, writesEnabled = true)

      (remoteOrganizationRepository.getOrganizationIdsForUser(_: String)(_: Flags))
        .expects(viewerOid, flags)
        .returning(mockResponse)
        .repeat(amountOfValidKoskiEntries)

      val parser = new LambdaLogParserHandler(remoteOrganizationRepository)
      val result = parser.handleRequest(mock[SQSEvent], mock[Context])

      assert(result.stored == 6, "Stored correct amount of log entries (Koski + Varda)")
      assert(result.skipped == 2, "Skipped entries")
      assert(result.failed == 1, "Non-parsable entries reported as failed")

      val dbEntries = DB.getAllItems
      assert(dbEntries.size() == 2, "No duplicate entries were stored to DB") // All 5 of our valid entries were identical except for Varda entry

      val dbEntry = dbEntries.get(1)
      assert(dbEntry.organizationOid.get(0) == mockOrganizationOid, "Correct organization oid was stored to DB")
      assert(dbEntry.studentOid == studentOid, "Correct student oid was stored to DB")
      assert(dbEntry.id == "2018-08-24T13:18:32.667+03;3;", "Correct ID was stored to DB")
      assert(dbEntry.raw.length > 100, "Raw log entry data stored to DB")

      val dbVardaEntry = dbEntries.get(0)
      assert(dbVardaEntry.organizationOid.get(0) == "1.2.246.562.10.27580498759", "Correct Varda organization oid was stored to DB")
      assert(dbVardaEntry.studentOid == "1.2.246.562.24.10000002335", "Correct Varda student oid was stored to DB")
      assert(dbVardaEntry.id == "2022-10-04T15:20:28.177714+00:00;104;backend-testing.varda-db.csc.fi", "Correct ID for Varda entry was stored to DB")
      assert(dbVardaEntry.raw.length > 100, "Raw Varda log entry data stored to DB")
    }

    it("Should store logs when student viewed own data") {
     verifySingleLogEntry("opiskeluoikeus-katsominen-self.log", "self")
    }

    it("Shuold store logs when viewer is huoltaja") {
      verifySingleLogEntry("opiskeluoikeus-katsominen-huoltaja.log", "huoltaja")
    }
  }

  private def verifySingleLogEntry(mockResourceName: String, expectedOrganization: String) {
    val logEntry = Source.fromResource(mockResourceName).mkString

    RemoteSQSRepository invokePrivate sendMessage(logEntry)

    while (!RemoteSQSRepository.hasMessages) Thread.sleep(1000)

    val parser = new LambdaLogParserHandler
    val result = parser.handleRequest(mock[SQSEvent], mock[Context])

    assert(result.stored == 1, "Was able to process self view entry")
    assert(result.skipped == 0, "No skipped entries")
    assert(result.failed == 0, "No failed entries was found")

    val dbEntries = DB.getAllItems
    assert(dbEntries.size() == 1, "Entry was stored to DB")

    val dbEntry = dbEntries.get(0)
    assert(dbEntry.organizationOid.get(0) == expectedOrganization, "Organization is correct")

  }
}
