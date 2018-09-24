import { lang } from 'util/preferences'

/**
 * Translates given key to the language currently in use.
 * Expects the translation lookup map to exist as a global (window) variable.
 * Prefer using this via the tagged template notation.
 * @example <pre><code>t`Oma Opintopolku`</code></pre>
 * @param {string} key Term to look up from the translation map
 * @returns {string} Translated text if translation found, else key
 */
export default key => {
  const translations = window.translationsMap || {}
  const versions = translations[key] || {}
  const translated = versions[lang]

  if (!translated) {
    console.error(`Translation missing for language ${lang}: ${key}`)
    return key
  }

  return translated
}
