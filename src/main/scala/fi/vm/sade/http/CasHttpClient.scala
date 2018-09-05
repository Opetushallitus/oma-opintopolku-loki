package fi.vm.sade.http

import fi.vm.sade.AuditLogParserSubSystemCode
import fi.vm.sade.utils.cas.{CasAuthenticatingClient, CasClient, CasParams}
import org.http4s.client._


object CasHttpClient {

  val sessionCookieName = "JSESSIONID"

  def apply(httpClient: Client, scheme_authority: String, params: CasParams = Params.permission) = {
    CasAuthenticatingClient(
      new CasClient(scheme_authority, httpClient),
      params,
      httpClient,
      Some(AuditLogParserSubSystemCode.code),
      sessionCookieName
    )
  }
}


object Params {
  private val permission_path = "/kayttooikeus-service"

  private def username = sys.env("username")
  private def password = sys.env("password")

  def permission: CasParams = CasParams(permission_path, username, password)
}

