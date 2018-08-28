package fi.vm.sade

/**
 * @author ${user.name}
 */
object App {

  def main(args : Array[String]) {
    def repository = new RemoteOrganizationRepository()

    repository.getOrganization("1.2.3.4.1000")
  }

}
