package fi.vm.sade

import org.scalamock.scalatest.MockFactory
import org.scalatest.{FunSpec, Matchers}

class App extends FunSpec with Matchers with MockFactory {

  describe("An application") {
    it("Should be able to receive SQS messages") {
      println(RemoteSQSRepository.getMessages)
    }
  }

}
