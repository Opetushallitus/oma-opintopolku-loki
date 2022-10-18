package fi.oph.omaopintopolkuloki.log

import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.should.Matchers

import scala.io.Source

class EntryParserTest extends AnyFunSpec with Matchers {
  describe("An EntryParser") {

    it("Should be able to parse a log entry") {
      val entry = EntryParser(Source.fromResource("opiskeluoikeus-katsominen-entry.log").mkString)

      assert(entry.user.get.oid == "1.2.345.678.90.11122233344", "Viewer oid parsed correctly")
      assert(entry.target.get.oppijaHenkiloOid == "1.2.123.456.78.99999999999", "Student oid parsed correctly")
      assert(entry.timestamp == "2018-08-24T13:18:38.439+03", "Timestamp parsed correctly")
      assert(entry.applicationType == "backend", "Application type parsed correctly")
      assert(entry.operation.get == "OPISKELUOIKEUS_KATSOMINEN", "Operation parsed correctly")
      assert(entry.`type` == "log", "Type parsed correctly")
      assert(entry.shouldStore , "Valid entry should be stored to database")
    }

    it("Should not fail when parsing oppija haku entry") {
      noException should be thrownBy {
        val entry = EntryParser(Source.fromResource("oppija-haku-entry.log").mkString)

        assert(entry.`type` == "log", "Type was parsed correctly")
        assert(entry.operation.get == "OPPIJA_HAKU", "Operation was parsed correctly")
      }
    }

    it("Should not fail when parsing health check entry") {
      noException should be thrownBy  {
        val entry = EntryParser(Source.fromResource("healthcheck-entry.log").mkString)

        assert(entry.`type` == "alive", "Type was parsed correctly")
      }
    }

    it("Should be able to parse Varda log entry") {
      val entry = EntryParser(Source.fromResource("varda-log-entry.log").mkString)

      assert(entry.user.get.oid == "1.2.246.562.24.22846384298", "Viewer oid parsed correctly")
      assert(entry.target.get.oppijaHenkiloOid == "1.2.246.562.24.10000002335", "Student oid parsed correctly")
      assert(entry.organizationOid.get == "1.2.246.562.10.27580498759", "Organization oid parsed correctly")
      assert(entry.timestamp == "2022-10-04T15:20:49.519887+00:00", "Timestamp parsed correctly")
      assert(entry.applicationType == "backend", "Application type parsed correctly")
      assert(entry.operation.get == "dataAccess", "Operation parsed correctly")
      assert(entry.`type` == "dataAccess", "Type parsed correctly")
      assert(entry.serviceName == "varda", "Service name parsed correctly")
      assert(entry.shouldStore, "Valid entry should be stored to database")
    }
  }
}
