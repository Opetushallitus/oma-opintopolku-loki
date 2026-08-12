package fi.oph.omaopintopolkuloki.log

import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.should.Matchers

import scala.io.Source

class EntryParserTest extends AnyFunSpec with Matchers {
  describe("An EntryParser") {

    it("Should be able to parse a log entry") {
      val entry = EntryParser(Source.fromResource("opiskeluoikeus-katsominen-entry.log").mkString)

      assert(entry.user.get.oid == "1.2.345.678.90.11122233344", "Viewer oid parsed correctly")
      assert(entry.studentOid.get == "1.2.123.456.78.99999999999", "Student oid parsed correctly")
      assert(entry.timestamp == "2018-08-24T13:18:38.439+03", "Timestamp parsed correctly")
      assert(entry.applicationType == "backend", "Application type parsed correctly")
      assert(entry.operation.get == "OPISKELUOIKEUS_KATSOMINEN", "Operation parsed correctly")
      assert(entry.`type` == "log", "Type parsed correctly")
      assert(entry.shouldStore , "Valid entry should be stored to database")
    }

    it("Should be able to parse a log entry where the target oid key is spelled oppijaHenkilöOid") {
      // Koski writes the target oid under oppijaHenkilöOid (with ö) for some operations,
      // e.g. VALPAS_OPPIJA_KATSOMINEN, and under oppijaHenkiloOid for others.
      val entry = EntryParser(Source.fromResource("valpas-oppija-katsominen-entry.log").mkString)

      assert(entry.user.get.oid == "1.2.246.562.24.00000000002", "Viewer oid parsed correctly")
      assert(entry.studentOid.get == "1.2.246.562.24.00000000001", "Student oid parsed correctly")
      assert(entry.timestamp == "2026-08-04T22:29:37.522+03", "Timestamp parsed correctly")
      assert(entry.applicationType == "backend", "Application type parsed correctly")
      assert(entry.operation.get == "VALPAS_OPPIJA_KATSOMINEN", "Operation parsed correctly")
      assert(entry.`type` == "log", "Type parsed correctly")
      assert(entry.serviceName == "koski", "Service name parsed correctly")
      assert(entry.shouldStore, "Valid entry should be stored to database")
    }

    it("Should not fail when parsing oppija haku entry") {
      noException should be thrownBy {
        val entry = EntryParser(Source.fromResource("oppija-haku-entry.log").mkString)

        assert(entry.`type` == "log", "Type was parsed correctly")
        assert(entry.operation.get == "OPPIJA_HAKU", "Operation was parsed correctly")
      }
    }

    it("Should skip an entry whose target holds no oppija oid at all") {
      // The oppija haku entry has target {"hakuEhto": ...}. Accepting further spellings of
      // the oid key must not make these look like entries we should store.
      val entry = EntryParser(Source.fromResource("oppija-haku-entry.log").mkString)

      assert(entry.studentOid.isEmpty, "Target carrying no oppija oid yields no student oid")
      assert(!entry.shouldStore, "Entry without a student oid should not be stored to database")
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
      assert(entry.studentOid.get == "1.2.246.562.24.10000002335", "Student oid parsed correctly")
      assert(entry.organizationOid.get == "1.2.246.562.10.27580498759", "Organization oid parsed correctly")
      assert(entry.timestamp == "2022-10-04T15:20:49.519887+00:00", "Timestamp parsed correctly")
      assert(entry.applicationType == "backend", "Application type parsed correctly")
      assert(entry.operation.get == "dataAccess", "Operation parsed correctly")
      assert(entry.`type` == "dataAccess", "Type parsed correctly")
      assert(entry.serviceName == "varda", "Service name parsed correctly")
      assert(entry.shouldStore, "Valid entry should be stored to database")
    }

    it("Should be able to parse Kitu log entry") {
      val entry = EntryParser(Source.fromResource("kitu-log-entry.log").mkString)

      assert(entry.user.get.oid == "1.2.246.562.24.22846384298", "Viewer oid parsed correctly")
      assert(entry.studentOid.get == "1.2.246.562.24.10000001224", "Student oid parsed correctly")
      assert(entry.organizationOid.get == "1.2.246.562.10.27580498748", "Organization oid parsed correctly")
      assert(entry.timestamp == "2025-10-04T15:20:49.519887+00:00", "Timestamp parsed correctly")
      assert(entry.applicationType == "backend", "Application type parsed correctly")
      assert(entry.operation.get == "dataAccess", "Operation parsed correctly")
      assert(entry.`type` == "dataAccess", "Type parsed correctly")
      assert(entry.serviceName == "kitu", "Service name parsed correctly")
      assert(entry.shouldStore, "Valid entry should be stored to database")
    }
  }
}
