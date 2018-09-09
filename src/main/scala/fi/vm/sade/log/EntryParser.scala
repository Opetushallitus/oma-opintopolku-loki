package fi.vm.sade.log

import org.json4s.{DefaultFormats, Formats}
import org.json4s.jackson.JsonMethods.parse

object EntryParser {

  implicit val formats: Formats = DefaultFormats

  def apply(entry: String): Entry = parse(entry).extract[Entry]
}


case class Entry(timestamp: String,
                 serviceName: String,
                 `type`: String,
                 applicationType: String,
                 operation: Option[String],
                 user: Option[User],
                 target: Option[Student]) {

  lazy val shouldStore: Boolean = target.nonEmpty && user.nonEmpty && operation.nonEmpty
}

case class User(oid: String)
case class Student(oppijaHenkiloOid: String)
