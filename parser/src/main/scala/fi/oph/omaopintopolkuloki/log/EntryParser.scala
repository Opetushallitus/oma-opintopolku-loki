package fi.oph.omaopintopolkuloki.log

import org.json4s.{DefaultFormats, Formats}
import org.json4s.jackson.JsonMethods.parse

object EntryParser {

  implicit val formats: Formats = DefaultFormats

  def apply(entry: String): Entry = parse(entry).extract[Entry]
}

case class Entry(
  timestamp: String,
  serviceName: String,
  `type`: String,
  logSeq: String,
  bootTime: String,
  hostname: String,
  applicationType: String,
  operation: Option[String],
  user: Option[User],
  target: Option[Student],
  organizationOid: Option[String]
) {

  lazy val studentOid: Option[String] = target.flatMap(_.oid)

  lazy val shouldStore: Boolean = studentOid.nonEmpty && user.nonEmpty && operation.nonEmpty

  lazy val getKey: String = bootTime + ";" + logSeq + ";" + hostname // this makes the log entry unique
}

case class User(oid: String)

/**
  * Koski writes the oid of the student whose data was accessed under `oppijaHenkiloOid` for some
  * operations and under `oppijaHenkilöOid` (with ö) for others. Both spellings are accepted.
  */
case class Student(oppijaHenkiloOid: Option[String], oppijaHenkilöOid: Option[String]) {

  lazy val oid: Option[String] = oppijaHenkiloOid.orElse(oppijaHenkilöOid)
}
