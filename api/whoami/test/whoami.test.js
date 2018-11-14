'use strict'

const aws = require('aws-sdk-mock')
const cas = require('../../common/src/client/cas')
const jestPlugin = require('serverless-jest-plugin')
const lambdaWrapper = jestPlugin.lambdaWrapper
const log = require('lambda-log')
const mod = require('../src/entrypoint')
const wrapped = lambdaWrapper.wrap(mod, { handler: 'handler' })

jest.mock('../../common/src/client/cas')

describe('whoami', () => {
  const shibbolethSecret = 'hyshys'

  const hetu = '120456-ABCD'
  const etunimet = 'Mikko Alfons'
  const kutsumanimi = 'Mikko'
  const sukunimi = 'Mallikas'
  const user = { hetu, etunimet, kutsumanimi, sukunimi }

  beforeAll(() => {
    log.options.silent = true
    aws.mock('SecretsManager', 'getSecretValue', {SecretString: JSON.stringify({shibbolethSecret})})
    cas.withCookie.mockImplementation((options, cookieCallback) => cookieCallback('JSESSIONID=testcookie'))
  })

  afterAll(() => {
    aws.restore('SecretsManager')
    jest.clearAllMocks()
  })

  it('returns 200 OK and user information for authenticated user', () => {
    return wrapped.run({headers: {security: shibbolethSecret, hetu, FirstName: etunimet, givenName: kutsumanimi, sn: sukunimi}}).then((response) => {
      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toEqual(user)
    })
  })

  it('parses headers correctly', () => {
    const sn = String.fromCharCode.apply(null, [84, 117, 117, 108, 105, 115, 112, 65475, 65444, 65475, 65444])
    return wrapped.run({headers: {security: shibbolethSecret, hetu, FirstName: etunimet, sn}}).then((response) => {
      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toEqual({
        hetu,
        etunimet: 'Mikko Alfons',
        sukunimi: 'Tuulispää'
      })
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

    return wrapped.run({headers: {hetu, FirstName: etunimet, givenName: kutsumanimi, sn: sukunimi}}).then((response) => {
      expect(response.statusCode).toBe(400)
      const body = JSON.parse(response.body)
      expect(body).toEqual({message: 'Missing headers'})
    })
  })

  it('returns 401 for unauthenticated user', () => {
    return wrapped.run({headers: {security: 'foo', hetu, FirstName: etunimet, givenName: kutsumanimi, sn: sukunimi}}).then((response) => {
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
