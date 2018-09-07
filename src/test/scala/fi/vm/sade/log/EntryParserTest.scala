package fi.vm.sade.log

import org.scalatest.FunSpec
import scala.io.Source

class EntryParserTest extends FunSpec {
  describe("An EntryParser") {

    it("Should be able to parse a log entry") {
      val entry = EntryParser(Source.fromResource("opiskeluoikeus-katsominen-entry.log").mkString)

      assume(entry.user.oid == "1.2.246.562.24.32762449346", "Viewer oid parsed correctly")
      assume(entry.target.oppijaHenkiloOid == "1.2.246.562.24.99973811748", "Student oid parsed correctly")
      assume(entry.timestamp == "2018-08-24T13:18:38.439+03", "Timestamp parsed correctly")
      assume(entry.applicationType == "backend", "Application type parsed correctly")
      assume(entry.operation == "OPISKELUOIKEUS_KATSOMINEN", "Operation parsed correctly")
    }
  }
}
