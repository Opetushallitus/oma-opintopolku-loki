'use strict'

const aws = require('aws-sdk-mock')
const cas = require('../../common/src/client/cas')
const jestPlugin = require('serverless-jest-plugin')
const lambdaWrapper = jestPlugin.lambdaWrapper
const log = require('lambda-log')
const mod = require('../src/entrypoint')
const AuditLogs = require('../src/model/AuditLogs')
const UserClient = require('../../common/src/client/UserClient')
const wrapped = lambdaWrapper.wrap(mod, { handler: 'handler' })

jest.mock('../../common/src/client/cas')
jest.unmock('../src/model/AuditLogs')
jest.unmock('../../common/src/client/UserClient')

describe('auditlog', () => {
  const shibbolethSecret = 'hyshys'

  const hetu = '120456-ABCD'

  const user = {
    oidHenkilo: '1.2.3',
    hetu,
    etunimet: 'Mikko Alfons',
    kutsumanimi: 'Mikko',
    sukunimi: 'Mallikas'
  }

  const organizationOid = 'o1'

  const logEntry = {
    id: '1',
    studentOid: '1.2.3',
    time: '12:34',
    organizationOid: [organizationOid]
  }

  const userDataFn = jest.fn(() => Promise.resolve({data: user}))

  beforeAll(() => {
    log.options.silent = true
    aws.mock('DynamoDB.DocumentClient', 'query', function(params, callback) {
      callback(null, {Items: [logEntry]})
    })
    aws.mock('SecretsManager', 'getSecretValue', {SecretString: JSON.stringify({shibbolethSecret})})
    AuditLogs.prototype._getOrganizationNames = jest.fn((oid) => Promise.resolve({oid, name: oid + '_name'}))
    cas.withCookie.mockImplementation((options, cookieCallback) => cookieCallback('JSESSIONID=testcookie'))
  })

  afterAll(() => {
    aws.restore('DynamoDB.DocumentClient')
    aws.restore('SecretsManager')
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    UserClient.prototype.getOid = userDataFn
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 OK and user information for authenticated user', () => {
    return wrapped.run({headers: {security: shibbolethSecret, hetu}}).then((response) => {
      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toEqual([{organizations: [{oid: organizationOid, name: organizationOid + '_name'}], timestamps: ['12:34']}])
      expect(response.headers).toEqual({'Cache-Control': 'private, max-age=600'})
      expect(userDataFn).toHaveBeenCalled()
    })
  })

  it('returns 200 OK and empty array when authenticated user is not found from oppijanumerorekisteri', () => {
    const auditLogFn = jest.fn()
    const originalFn = AuditLogs.prototype.getAllForOid
    AuditLogs.prototype.getAllForOid = auditLogFn

    UserClient.prototype.getOid = jest.fn(() => {
      const error = new Error('Request failed with status code 404')
      error.response = {status: 404}
      return Promise.reject(error)
    })
    return wrapped.run({headers: {security: shibbolethSecret, hetu}}).then((response) => {
      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toEqual([])
      expect(response.headers).toEqual({'Cache-Control': 'private, max-age=600'})
      expect(auditLogFn).not.toHaveBeenCalled
      AuditLogs.prototype.getAllForOid = originalFn
    })
  })

  it('returns 200 OK and empty array when query result is undefined', () => {
    aws.remock('DynamoDB.DocumentClient', 'query', function(params, callback) {
      callback(null, null)
    })

    return wrapped.run({headers: {security: shibbolethSecret, hetu}}).then((response) => {
      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toEqual([])
      expect(response.headers).toEqual({'Cache-Control': 'private, max-age=600'})
      expect(userDataFn).toHaveBeenCalled()
    })
  })

  it('returns 400 when required headers are missing', () => {
    return wrapped.run({headers: {}}).then((response) => {
      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual('missing headers')
      expect(response.headers).toBeUndefined()
      expect(userDataFn).not.toHaveBeenCalled()
    })

    return wrapped.run({headers: {security: shibbolethSecret}}).then((response) => {
      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual('missing headers')
      expect(response.headers).toBeUndefined()
      expect(userDataFn).not.toHaveBeenCalled()
    })

    return wrapped.run({headers: {hetu}}).then((response) => {
      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual('missing headers')
      expect(response.headers).toBeUndefined()
      expect(userDataFn).not.toHaveBeenCalled()
    })
  })

  it('returns 401 for unauthenticated user', () => {
    return wrapped.run({headers: {security: 'foo', hetu}}).then((response) => {
      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual('unauthorized request')
      expect(response.headers).toBeUndefined()
      expect(userDataFn).not.toHaveBeenCalled()
    })
  })

  it('returns 500 when user data query fails with non-404 error', () => {
    UserClient.prototype.getOid = jest.fn(() => {
      const error = new Error('Internal server error')
      error.response = {status: 500}
      return Promise.reject(error)
    })
    return wrapped.run({headers: {security: shibbolethSecret, hetu}}).then((response) => {
      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual('internal server error')
      expect(response.headers).toBeUndefined()
    })
  })

  it('returns 500 when database query fails', () => {
    aws.remock('DynamoDB.DocumentClient', 'query', function(params, callback) {
      callback(new Error('Oops!'), null)
    })

    return wrapped.run({headers: {security: shibbolethSecret, hetu}}).then((response) => {
      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual('internal server error')
      expect(response.headers).toBeUndefined()
    })
  })
})
