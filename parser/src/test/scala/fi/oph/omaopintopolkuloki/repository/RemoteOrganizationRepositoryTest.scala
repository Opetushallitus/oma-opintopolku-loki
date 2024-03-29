package fi.oph.omaopintopolkuloki.repository

import cats.effect.IO
import fi.oph.omaopintopolkuloki.http.HttpClient
import org.http4s.Uri
import org.scalamock.scalatest.MockFactory
import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.should.Matchers
import scalacache.Flags

import scala.io.Source


class RemoteOrganizationRepositoryTest extends AnyFunSpec with Matchers with MockFactory {

  implicit val flags: Flags = Flags(readsEnabled = false, writesEnabled = false) // no cache for tests

  describe("A RemoteOrganizationRepository") {

    it("Should be able to get organizations for user") {
      val repository = new RemoteOrganizationRepository {
        override protected lazy val casHttpClient: HttpClient = new HttpClient {
          override def get[ResultType](uri: Uri)(decode: Decode[ResultType]): IO[ResultType] = {
            IO.pure[ResultType](decode(200, Source.fromResource("permissions.json").mkString, null))
          }
        }
      }

      val permissions: Array[OrganizationPermission] = repository.getOrganizationIdsForUser("1.2.3")

      assert(permissions.length == 1, "Contains one permission")
      assert(permissions.headOption.get.organisaatioOid == "1.2.246.562.10.82388989657", "Has correct organization oid")
    }
  }
}
