import t from 'util/translate'

export const getTranslatedUsagePermissionDescription = (isMyDataUse) => {
  const permission =
    isMyDataUse
      ? 'Olet antanut tälle palvelutarjoajalle luvan käyttää tietojasi.'
      : 'Lakiin perustuva tiedonkäyttölupa.'
  return t(permission)
}
