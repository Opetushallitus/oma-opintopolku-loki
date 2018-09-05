package fi.vm.sade

import scala.concurrent.duration.Duration

object Configuration {
  val scheme_authority = "https://virkailija.testiopintopolku.fi"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}/kayttooikeus-service/kayttooikeus/kayttaja?oidHenkilo=${oid}"
  def organizationDetailsURL(oid: String) = s"${scheme_authority}/organisaatio-service/rest/organisaatio/v3/${oid}?includeImage=false"

  val maxHttpRequestThreads = 10
  val max_api_call_duration = Duration(30, "seconds")

}

object AuditLogParserSubSystemCode {
  val code = "auditlog"
}
