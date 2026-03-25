import t from 'util/translate'

export const getTranslatedUsagePermissionDescription = (isMyDataUse, isJakolinkkiUse) => {
  if (isJakolinkkiUse) {
    return t('Oma opintopolku -palvelussa luomiesi omien opintosuoritusten jakolinkkien käyttökerrat')
  }
  const permission =
    isMyDataUse
      ? 'Olet antanut tälle palvelutarjoajalle luvan käyttää tietojasi.'
      : 'Lakiin perustuva tiedonkäyttölupa.'
  return t(permission)
}
