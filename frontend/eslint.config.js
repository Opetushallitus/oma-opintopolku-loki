const js = require('@eslint/js')
const react = require('eslint-plugin-react')
const jest = require('eslint-plugin-jest')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser
      }
    },
    settings: {
      react: {
        version: '17'
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      'no-import-assign': 'off'
    }
  },
  {
    files: ['src/**/*.test.{js,jsx}', 'src/__mocks__/**/*.js', 'src/**/testUtils.js', 'test/**/*.{js,jsx}'],
    plugins: {
      jest
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.nodeBuiltin
      }
    },
    rules: {
      ...jest.configs.recommended.rules,
      'jest/no-done-callback': 'off'
    }
  },
  {
    files: ['src/__mocks__/**/*.js', 'test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly'
      }
    }
  }
]
