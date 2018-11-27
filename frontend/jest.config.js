require('dotenv').config()

module.exports = {
  globalSetup: "jest-puppeteer/node_modules/jest-environment-puppeteer/setup",
  globalTeardown: "jest-puppeteer/node_modules/jest-environment-puppeteer/teardown",
  testEnvironment: "jest-puppeteer/node_modules/jest-environment-puppeteer",
  setupTestFrameworkScriptFile: "jest-puppeteer/node_modules/expect-puppeteer"
}
