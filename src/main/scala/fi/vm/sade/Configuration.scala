package fi.vm.sade

import com.amazonaws.regions.Regions


object Configuration {
  val scheme_authority = "https://virkailija.testiopintopolku.fi"

  def userOrganizationsURL(oid: String) = s"${scheme_authority}/kayttooikeus-service/kayttooikeus/kayttaja?oidHenkilo=${oid}"
  def organizationDetailsURL(oid: String) = s"${scheme_authority}/organisaatio-service/rest/organisaatio/v3/${oid}?includeImage=false"
}

object AuditLogParserSubSystemCode {
  val code = "auditlog"
}
