package fi.vm.sade

import org.slf4j.LoggerFactory

/**
 * @author ${user.name}
 */
object App {

  val logger = LoggerFactory.getLogger(this.getClass)

  def main(args : Array[String]) {
    def repository = new RemoteOrganizationRepository()

    logger.info("Application started")
    repository.getOrganization("1.2.3.4.1000")
  }

}
