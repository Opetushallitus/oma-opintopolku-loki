const BaseUrl = `http://localhost:${process.env.TEST_PORT}/`

describe('Oma Opintopolku -loki', () => {
  beforeAll(async () => {
    await page.goto(BaseUrl)
  })

  it('should display text', async () => {
    await expect(page).toMatch('Tietojeni käyttö')
  })
})
