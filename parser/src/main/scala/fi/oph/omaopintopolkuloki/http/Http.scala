package fi.oph.omaopintopolkuloki.http

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import fi.oph.omaopintopolkuloki.conf.Configuration._
import org.http4s.blaze.client.BlazeClientBuilder
import org.http4s.client.Client
import org.http4s.{Request, Uri}

import scala.concurrent.ExecutionContext.global

trait HttpClient {
  type Decode[ResultType] = (Int, String, Request[IO]) => ResultType

  def get[ResultType](uri: Uri)(decode: Decode[ResultType]): IO[ResultType]
}

object Http {
  implicit private val runtime: IORuntime = cats.effect.unsafe.IORuntime.global

  def apply(useCas: Boolean = false): HttpClient = {
    val client = BlazeClientBuilder[IO](global)
      .withMaxTotalConnections(maxRequestThreads)
      .allocated
      .map(_._1)
      .unsafeRunSync()

    if (useCas) {
      new Http(CasHttpClient(client, baseURI.renderString + "/cas"))
    } else {
      new Http(client)
    }
  }
}

private class Http(client: Client[IO]) extends HttpClient {

  def get[ResultType](uri: Uri)(decode: Decode[ResultType]): IO[ResultType] = {
    processRequest(Request[IO](uri = uri))(decode)
  }

  private def processRequest[ResultType](request: Request[IO])(decoder: (Int, String, Request[IO]) => ResultType): IO[ResultType] = {
    client.run(request).use { response =>
      response.as[String].map(text => decoder(response.status.code, text, request))
    }
  }
}
