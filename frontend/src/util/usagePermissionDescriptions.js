import t from 'util/translate'

export const getTranslatedUsagePermissionDescription = (isMyDataUse) => {
  const permission =
    isMyDataUse
      ? 'Olet antanut tälle palvelutarjoajalle suostumuksen käyttää tietojasi.'
      : 'Lakiin perustuva tiedonkäyttöoikeus.'
  return t(permission)
}
