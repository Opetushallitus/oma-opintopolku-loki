package fi.vm.sade

import org.slf4j.LoggerFactory

/**
 * @author ${user.name}
 */
object App {

  val logger = LoggerFactory.getLogger(this.getClass)


  val heikki_testaa = "1.2.246.562.24.36742098962"
  val auditlog = "1.2.246.562.24.27696726056"

  def main(args : Array[String]) {
    def repository = new RemoteOrganizationRepository()

    logger.info("Application started")


    val organisaatiot = repository.getOrganizationIdsForUser(heikki_testaa)

    organisaatiot.map(o => println(s"Found organization ${o.organisaatioOid}"))

  }

}
