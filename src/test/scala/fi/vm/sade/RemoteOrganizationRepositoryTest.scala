package fi.vm.sade

import fi.vm.sade.http.HttpClient
import fi.vm.sade.repository.{OrganizationPermission, RemoteOrganizationRepository}
import org.http4s.{Request, Uri}
import org.scalatest.{FunSpec, Matchers}
import org.scalamock.scalatest.MockFactory
import scalacache.Flags
import scalaz.concurrent.Task

import scala.io.Source


class RemoteOrganizationRepositoryTest extends FunSpec with Matchers with MockFactory {

  implicit val flags: Flags = Flags(readsEnabled = false, writesEnabled = false) // no cache for tests

  describe("A RemoteOrganizationRepository") {

    it("Should be able to get organizations for user") {
      val repository = new RemoteOrganizationRepository {
        override protected lazy val casHttpClient: HttpClient = new HttpClient {
          override def get[ResultType](uri: Uri)(decode: Decode[ResultType]): Task[ResultType] = {
            Task.now[ResultType](decode(200, Source.fromResource("permissions.json").mkString, null))
          }
        }
      }

      val permissions: Array[OrganizationPermission] = repository.getOrganizationIdsForUser("1.2.3")

      assume(permissions.length == 1, "Contains one permission")
      assume(permissions.headOption.get.organisaatioOid == "1.2.246.562.10.82388989657", "Has correct organization oid")
    }
  }
}
