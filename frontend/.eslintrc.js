module.exports = {
  extends: [
    "standard",
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ],
  settings: {
    "react": {
      "version": "16.5"
    }
  },
  globals: {
    "page": true,
    "browser": true,
    "jestPuppeteer": true
  }
}
