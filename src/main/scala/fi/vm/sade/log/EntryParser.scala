package fi.vm.sade.log

import java.util.Date

import org.json4s.{DefaultFormats, Formats}
import org.json4s.jackson.JsonMethods.parse

object EntryParser {

  implicit val formats: Formats = DefaultFormats

  def apply(entry: String): Entry = parse(entry).extract[Entry]
}


case class Entry(timestamp: String, serviceName: String, applicationType: String, operation: String, user: User, target: Student)
case class User(oid: String)
case class Student(oppijaHenkiloOid: String)
