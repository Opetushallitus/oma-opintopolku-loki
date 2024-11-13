package vm.sade.utils.cas

import fi.vm.sade.utils.cas.CasParams
import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.{BeforeAndAfter, PrivateMethodTester}

class CasClientTest extends AnyFunSpec with Matchers with PrivateMethodTester with BeforeAndAfter {
  describe("CasParams") {
    it("Should format securityUri path properly, with leading slash")  {
      val params = CasParams("/kayttooikeus-service", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/j_spring_cas_security_check")
    }
    it("Should format securityUri path properly, with trailing and leading slash") {
      val params = CasParams("/kayttooikeus-service/", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/j_spring_cas_security_check")
    }
    it("Should format securityUri path properly, with trailing slash") {
      val params = CasParams("kayttooikeus-service/", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/j_spring_cas_security_check")
    }
    it("Should format securityUri path properly, without trailing or leading slash") {
      val params = CasParams("kayttooikeus-service", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/j_spring_cas_security_check")
    }
    it("Should format securityUri path properly, with leading slash and custom security URI suffix") {
      val params = CasParams("/kayttooikeus-service", "security_uri_suffix", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/security_uri_suffix")
    }
    it("Should format securityUri path properly, with trailing and leading slash and custom security URI suffix") {
      val params = CasParams("/kayttooikeus-service/", "security_uri_suffix","example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/security_uri_suffix")
    }
    it("Should format securityUri path properly, without trailing edge and custom security URI suffix") {
      val params = CasParams("kayttooikeus-service/", "security_uri_suffix", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/security_uri_suffix")
    }
    it("Should format securityUri path properly, without trailing or leading edge and custom security URI suffix") {
      val params = CasParams("kayttooikeus-service", "security_uri_suffix_test", "example", "passwd")
      params.service.securityUri.path.renderString should be("/kayttooikeus-service/security_uri_suffix_test")
    }
  }
}
