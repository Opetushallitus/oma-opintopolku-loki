package fi.vm.sade

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import fi.vm.sade.repository.{OrganizationPermission, Permission, RemoteOrganizationRepository, RemoteSQSRepository}
import org.scalamock.scalatest.MockFactory
import org.scalatest.{FunSpec, Matchers, PrivateMethodTester}
import scalacache.Flags

import scala.io.Source

class LambdaLogParserHandlerTest extends FunSpec with Matchers with MockFactory with PrivateMethodTester {

  describe("LambdaLogParserHandler") {

    it("Should store logs from SQS to database") {

      // First store some logs to SQS
      val entryFiles = List("opiskeluoikeus-katsominen-entry.log", "oppija-haku-entry.log", "healthcheck-entry.log")

      val sendMessage = PrivateMethod[Unit]('sendMessage)

      /*
      entryFiles.foreach(file => {
        val logEntry = Source.fromResource(file).mkString
        RemoteSQSRepository invokePrivate sendMessage(logEntry)
      })
      */

      val remoteOrganizationRepository: RemoteOrganizationRepository = mock[RemoteOrganizationRepository]
      val mockResponse = List(OrganizationPermission("1.2.3", List(Permission("ATARU_HAKEMUS", "READ")).toArray)).toArray
      val flags = Flags(readsEnabled = true, writesEnabled = true)

      (remoteOrganizationRepository.getOrganizationIdsForUser (_ : String)(_ : Flags))
        .expects("1.2.345.678.90.11122233344", flags)
        .returning(mockResponse)
        .repeat(5)


      val parser = new LambdaLogParserHandler(remoteOrganizationRepository)
      val result = parser.handleRequest(mock[SQSEvent], mock[Context])

      println(result)
    }
  }

}
