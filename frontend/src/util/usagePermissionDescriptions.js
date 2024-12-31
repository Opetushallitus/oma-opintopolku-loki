import t from 'util/translate'

export const getTranslatedUsagePermissionDescription = (isMyDataUse, isJakolinkkiUse) => {
  const permission = (isMyDataUse && isJakolinkkiUse)
    ? 'Oma Opintopolku -palvelussa luomiesi jakolinkkien käyttökerrat'
    : isMyDataUse
      ? 'Olet antanut tälle palvelutarjoajalle luvan käyttää tietojasi.'
      : 'Lakiin perustuva tiedonkäyttölupa.'
  return t(permission)
}
