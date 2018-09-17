import Cookies from 'js-cookie'

export default key => {
  const lang = Cookies.get('lang') || 'fi'
  const translations = window.translationsMap || {}
  const versions = translations[key] || {}
  const translated = versions[lang]

  if (!translated) {
    console.error(`Translation missing for language ${lang}: ${key}`)
    return key
  }

  return translated
}
