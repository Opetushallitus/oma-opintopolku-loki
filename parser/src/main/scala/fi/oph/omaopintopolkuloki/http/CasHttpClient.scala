package fi.oph.omaopintopolkuloki.http

import fi.oph.omaopintopolkuloki.conf.Configuration
import fi.vm.sade.utils.cas.{CasAuthenticatingClient, CasClient, CasParams}
import org.http4s.client._


object CasHttpClient {

  val sessionCookieName = "JSESSIONID"

  def apply(httpClient: Client, scheme_authority: String, params: CasParams = Params.permission) = {
    CasAuthenticatingClient(
      new CasClient(scheme_authority, httpClient),
      params,
      httpClient,
      Some(AuditLogParserSubsystemCode.code),
      sessionCookieName
    )
  }
}


object Params {
  private lazy val permission_path = "/kayttooikeus-service"

  private lazy val credentials = Configuration.getSecrets

  def permission: CasParams = CasParams(permission_path, credentials.username, credentials.password)
}

