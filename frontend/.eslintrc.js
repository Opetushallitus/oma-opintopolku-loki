module.exports = {
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:jest/recommended'
  ],
  settings: {
    react: {
      version: '16.14'
    }
  },
  globals: {
    page: true,
    browser: true,
    jestPuppeteer: true
  },
  rules: {
    'jest/no-done-callback': 'off',
    'no-import-assign': 'off'
  }
}
