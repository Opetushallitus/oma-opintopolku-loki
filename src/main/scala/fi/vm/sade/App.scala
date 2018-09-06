package fi.vm.sade

import java.util.Date

import org.slf4j.LoggerFactory
import com.typesafe.config.ConfigFactory
import fi.vm.sade.db.{DB, LogEntry}

/**
 * @author ${user.name}
 */
object App {

  val logger = LoggerFactory.getLogger(this.getClass)

  val config = ConfigFactory.load

  val heikki_testaa = "1.2.246.562.24.36742098962"
  val auditlog = "1.2.246.562.24.27696726056"

  val db = DB.apply(config)

  def main(args : Array[String]) {
    def repository = new RemoteOrganizationRepository(config)

    logger.info("Application started")

    val organisaatiot = repository.getOrganizationIdsForUser(heikki_testaa)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

    val organizations = repository.getOrganizationsForUser(heikki_testaa)

    organizations.map(o => {
      db.save(new LogEntry(new Date(), "123", o.oid))
      println(o.nimi.fi.get)
    })
  }
}

