import { lang } from 'util/preferences'

/**
 * Translates given key to the language currently in use.
 * Expects the translation lookup map to exist as a global (window) variable.
 * Prefer using this via the tagged template notation.
 * @example <pre><code>t`Oma Opintopolku`</code></pre>
 * @param {string} key Term (non-interpolated string when using tagged template) to look up from the translation map
 * @returns {string} Translated text if translation found, else key
 */
export default key => {
  const isTaggedTemplate = key.hasOwnProperty('raw')

  if (isTaggedTemplate && key.length > 1) {
    console.error('Unsupported translation usage: Using tagged template notation does not support interpolation.')
  }

  const parsedKey = isTaggedTemplate ? key[0] : key
  const translations = window.translationsMap || {}
  const versions = translations[parsedKey] || {}
  const translated = versions[lang]

  if (!translated) {
    console.error(`Translation missing for language ${lang}: ${parsedKey}`)
    return parsedKey
  }

  return translated
}
