import fi.vm.sade.utils.cas.CasParams
import org.scalamock.scalatest.MockFactory
import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.must.Matchers.be
import org.scalatest.matchers.should.Matchers.convertToAnyShouldWrapper
import org.scalatest.{BeforeAndAfter, PrivateMethodTester}

class CasClientTest extends AnyFunSpec with MockFactory with PrivateMethodTester with BeforeAndAfter {
  describe("CasParams") {
    it("Should format securityUri path properly on http4s versions >= 0.23.14")  {
      val params = CasParams("/foo-bar-baz", "example", "passwd")
      params.service.securityUri.path.renderString should be("/foo-bar-baz/j_spring_cas_security_check")
    }
  }
}
