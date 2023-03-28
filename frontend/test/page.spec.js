const jestPuppeteerConfig = require('../jest-puppeteer.config')

const BaseUrl = `http://localhost:${jestPuppeteerConfig.server.port}/`

describe('Oma Opintopolku -loki', () => {
  beforeAll(async () => {
    await page.goto(BaseUrl)
  })

  it('should display text', async () => {
    expect(await page.content()).toMatch('Tietojeni käyttö')
  })

  it('should display correct title', async () => {
    const pageTitle = await page.title()
    expect(pageTitle).toMatch('Oma opintopolku - tietojeni käyttö')
  })
})
