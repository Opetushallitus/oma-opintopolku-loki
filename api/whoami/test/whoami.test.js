'use strict'

const aws = require('aws-sdk-mock')
const cas = require('../../common/src/client/cas')
const jestPlugin = require('serverless-jest-plugin')
const lambdaWrapper = jestPlugin.lambdaWrapper
const log = require('lambda-log')
const mod = require('../src/entrypoint')
const UserClient = require('../../common/src/client/UserClient')
const wrapped = lambdaWrapper.wrap(mod, { handler: 'handler' })

jest.mock('../../common/src/client/cas')
jest.unmock('../../common/src/client/UserClient')

describe('whoami', () => {
  const shibbolethSecret = 'hyshys'

  const hetu = '120456-ABCD'

  const user = {
    oidHenkilo: '1.2.3',
    hetu,
    etunimet: 'Mikko Alfons',
    kutsumanimi: 'Mikko',
    sukunimi: 'Mallikas'
  }

  beforeAll(() => {
    log.options.silent = true
    aws.mock('SecretsManager', 'getSecretValue', {SecretString: JSON.stringify({shibbolethSecret})})
    UserClient.prototype.getOid = jest.fn(() => Promise.resolve({ data: user}))
    cas.withCookie.mockImplementation((options, cookieCallback) => cookieCallback('JSESSIONID=testcookie'))
  })

  afterAll(() => {
    aws.restore('SecretsManager')
    jest.clearAllMocks()
  })

  it('returns 200 OK and user information for authenticated user', () => {
    return wrapped.run({headers: {security: shibbolethSecret, hetu}}).then((response) => {
      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toEqual(user)
    })
  })

  it('returns 400 when required headers are missing', () => {
    return wrapped.run({headers: {}}).then((response) => {
      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toEqual({message: 'Missing headers'})
    })

    return wrapped.run({headers: {security: shibbolethSecret}}).then((response) => {
      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toEqual({message: 'Missing headers'})
    })

    return wrapped.run({headers: {hetu}}).then((response) => {
      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toEqual({message: 'Missing headers'})
    })
  })

  it('returns 401 for unauthenticated user', () => {
    return wrapped.run({headers: {security: 'foo', hetu}}).then((response) => {
      expect(response.statusCode).toBe(401)
      const body = JSON.parse(response.body)
      expect(body).toEqual({message: 'Not authenticated'})
    })
  })

  it('returns 500 when unhandled error occurs', () => {
    return wrapped.run({}).then((response) => {
      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual('internal server error')
    })
  })
})
