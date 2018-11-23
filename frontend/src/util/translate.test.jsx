import t from './translate'

describe('translate', () => {
  it('should log error for missing translations', () => {
    console.error = jest.fn()
    t('Tuntematon teksti')
    expect(console.error).toHaveBeenCalledWith('Translation missing for language fi: Tuntematon teksti')
  })
})
