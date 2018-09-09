package fi.vm.sade

import java.util.Date

import org.slf4j.LoggerFactory
import fi.vm.sade.db.{DB, LogEntry}

/**
 * @author ${user.name}
 */
object App {

  val logger = LoggerFactory.getLogger(this.getClass)

  val heikki_testaa = "1.2.246.562.24.36742098962"
  val auditlog = "1.2.246.562.24.27696726056"

  def main(args : Array[String]) {
    val repository = new RemoteOrganizationRepository

    logger.info("Application started")

    val organisaatiot = repository.getOrganizationIdsForUser(heikki_testaa)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

    val organizations = repository.getOrganizationsForUser(heikki_testaa)

    organizations.map(o => {
      DB.save(new LogEntry("tänään", "123", List(o.oid)))
      println(o.nimi.fi.get)
    })
  }
}

