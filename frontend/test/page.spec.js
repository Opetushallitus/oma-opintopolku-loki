const BaseUrl = 'http://localhost:8080/'

describe('Oma Opintopolku -loki', () => {
  beforeAll(async () => {
    await page.goto(BaseUrl)
  })

  it('should display text', async () => {
    await expect(page).toMatch('Oma Opintopolku -loki')
  })
})
