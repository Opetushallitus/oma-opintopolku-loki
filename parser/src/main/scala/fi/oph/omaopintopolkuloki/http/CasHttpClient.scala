package fi.oph.omaopintopolkuloki.http

import cats.effect.IO
import fi.oph.omaopintopolkuloki.conf.Configuration
import fi.vm.sade.utils.cas.{CasAuthenticatingClient, CasClient, CasParams}
import org.http4s.client._


object CasHttpClient {

  val sessionCookieName = "JSESSIONID"

  def apply(httpClient: Client[IO], schemeAuthority: String, params: CasParams = Params.permission): Client[IO] = {
    CasAuthenticatingClient(
      new CasClient(schemeAuthority, httpClient, AuditLogCallerId.code),
      params,
      httpClient,
      AuditLogCallerId.code,
      sessionCookieName
    )
  }
}


object Params {
  private lazy val permission_path = "/kayttooikeus-service"

  private lazy val credentials = Configuration.getSecrets

  def permission: CasParams = CasParams(permission_path, credentials.username, credentials.password)
}

