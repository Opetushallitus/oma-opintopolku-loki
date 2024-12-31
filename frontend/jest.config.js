require('dotenv').config()

module.exports = {
  testEnvironment: process.env.JEST_ENV,
  moduleDirectories: [
    'node_modules',
    'src',
    'resources'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/src/__mocks__/filemock.js'
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  preset: 'jest-puppeteer',
  setupFiles: [
    '<rootDir>/src/util/testSetup.js'
  ]
}
