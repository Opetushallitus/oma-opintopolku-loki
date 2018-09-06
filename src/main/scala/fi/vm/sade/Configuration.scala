package fi.vm.sade

import com.amazonaws.regions.Regions

import scala.concurrent.duration.Duration

object Configuration {
  val scheme_authority = "https://virkailija.testiopintopolku.fi"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}/kayttooikeus-service/kayttooikeus/kayttaja?oidHenkilo=${oid}"
  def organizationDetailsURL(oid: String) = s"${scheme_authority}/organisaatio-service/rest/organisaatio/v3/${oid}?includeImage=false"

  val maxHttpRequestThreads = 10
  val max_api_call_duration = Duration(30, "seconds")

  val cacheHost = "localhost"
  val cachePort = 6379
  val cacheTTL = Duration(1, "hour")

  val dynamodbEndpoint = "http://localhost:8000"
  val dynamodbRegion = Regions.EU_WEST_1

}

object AuditLogParserSubSystemCode {
  val code = "auditlog"
}
