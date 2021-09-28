package fi.oph.omaopintopolkuloki.conf

import com.amazonaws.services.secretsmanager.AWSSecretsManager
import com.amazonaws.services.secretsmanager.model.GetSecretValueResult
import org.scalamock.scalatest.MockFactory
import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.should.Matchers

class SecretsClientTest extends AnyFunSpec with Matchers with MockFactory {
  describe("Secrets Client") {

    it("Can extract username and password") {

      val mockSecretsManager = mock[AWSSecretsManager]

      val secretsClient = new SecretsClient {
        override lazy val secretsManagerClient: AWSSecretsManager = mockSecretsManager
      }

      (mockSecretsManager.getSecretValue _).expects(*).returning(new GetSecretValueResult().withSecretString(
        """
          {
            "accountId": "1234567890",
            "username" : "azurediamond",
            "password" : "hunter2"
          }
        """
      ))

      val credentials = secretsClient.getSecrets

      assert(credentials.username == "azurediamond")
      assert(credentials.password == "hunter2")
      assert(credentials.accountId == "1234567890")

    }
  }
}
