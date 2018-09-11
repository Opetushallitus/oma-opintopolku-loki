package fi.vm.sade.log

import org.scalatest.{FunSpec, Matchers}

import scala.io.Source

class EntryParserTest extends FunSpec with Matchers {
  describe("An EntryParser") {

    it("Should be able to parse a log entry") {
      val entry = EntryParser(Source.fromResource("opiskeluoikeus-katsominen-entry.log").mkString)

      assume(entry.user.get.oid == "1.2.345.678.90.11122233344", "Viewer oid parsed correctly")
      assume(entry.target.get.oppijaHenkiloOid == "1.2.123.456.78.99999999999", "Student oid parsed correctly")
      assume(entry.timestamp == "2018-08-24T13:18:38.439+03", "Timestamp parsed correctly")
      assume(entry.applicationType == "backend", "Application type parsed correctly")
      assume(entry.operation.get == "OPISKELUOIKEUS_KATSOMINEN", "Operation parsed correctly")
      assume(entry.`type` == "log", "Type parsed correctly")
      assume(entry.shouldStore , "Valid entry should be stored to database")
    }

    it("Should not fail when parsing oppija haku entry") {
      noException should be thrownBy {
        val entry = EntryParser(Source.fromResource("oppija-haku-entry.log").mkString)

        assume(entry.`type` == "log", "Type was parsed correctly")
        assume(entry.operation.get == "OPPIJA_HAKU", "Operation was parsed correctly")
      }
    }

    it("Should not fail when parsing health check entry") {
      noException should be thrownBy  {
        val entry = EntryParser(Source.fromResource("healthcheck-entry.log").mkString)

        assume(entry.`type` == "alive", "Type was parsed correctly")
      }
    }
  }
}
