const AuditLogs = require('../model/AuditLogs')
const AWS = require('aws-sdk')
const config = require('config');

const SecretManager = require('../../../common/src/auth/SecretManager')
const UserClient = require('../../../common/src/client/UserClient')

const log = require('lambda-log')
const deepOmit = require('omit-deep-lodash')

let AuditLog
let secretManager
let userClient

const hasRequiredHeaders = ({ headers }) => headers && headers.security && headers.hetu

module.exports = async (event, context) => {
  try {
    log.options.meta = { event: { ...context, ...deepOmit(event, 'security', 'hetu') } }
    log.options.debug = true

    log.info('Received an audit log request')

    if (!hasRequiredHeaders(event)) {
      return {
        statusCode: 400,
        body: 'missing headers'
      }
    }

    const { hetu, security } = event.headers

    secretManager = secretManager || new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))
    const isAuthenticated = await secretManager.authenticateRequest(security)

    if (!isAuthenticated) {
      log.debug(`Unauthorized request`)
      return {
        statusCode: 401,
        body: 'unauthorized request'
      }
    }

    userClient = userClient || new UserClient(config.get('backend.timeout'), config.get('backend.host'), secretManager)

    let oidHenkilo
    try {
      result = await userClient.getUser(hetu)
      oidHenkilo = result.oidHenkilo
    } catch (err) {
      if (err.response && err.response.status === 404) {
        log.debug('Received 404 response for user data query')
      } else {
        throw err
      }
    }

    let logEntries
    if (oidHenkilo) {
      AuditLog = AuditLog || new AuditLogs(new AWS.DynamoDB.DocumentClient())
      logEntries = await AuditLog.getAllForOid(oidHenkilo)
    } else {
      logEntries = []
    }

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': `private, max-age=${config.get('cache.max-age')}`
      },
      body: JSON.stringify(logEntries)
    }

  } catch (error) {
    log.error('Failed to serve auditlog request', { error })

    return {
      statusCode: 500,
      body: 'internal server error'
    }
  }
}
