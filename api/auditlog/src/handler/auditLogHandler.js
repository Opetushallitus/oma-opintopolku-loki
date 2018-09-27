const AuditLogs = require('../model/AuditLogs')
const AWS = require('aws-sdk')
const config = require('config');

const SecretManager = require('../../../common/src/auth/SecretManager')
const UserClient = require('../../../common/src/client/UserClient')

const log = require('lambda-log')
const deepOmit = require('omit-deep-lodash')

const AuditLog = new AuditLogs(new AWS.DynamoDB.DocumentClient())
const secretManager = new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))

const userClient = new UserClient(
  config.get('backend.timeout'),
  config.get('backend.host'),
  config.get('secret.name')
)

const hasRequiredHeaders = ({ headers }) => headers && headers.secret && headers.hetu

module.exports = async (event, context) => {
  try {
    log.options.meta = { event: { ...context, ...deepOmit(event, 'secret', 'hetu') } }
    log.options.debug = true

    log.info('Received an audit log request')

    if (!hasRequiredHeaders(event)) {
      return {
        statusCode: 400,
        body: 'missing headers'
      }
    }

    const { hetu, secret } = event.headers

    const { oidHenkilo } = await userClient.getUser(hetu)
    
    const isAuthenticated = await secretManager.authenticateRequest(secret)

    if (!isAuthenticated) {
      log.debug(`Unauthorized request`)
      return {
        statusCode: 401,
        body: 'unauthorized request'
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': `max-age=${config.get('cache.max-age')}`
      },
      body: JSON.stringify(await AuditLog.getAllForOid(oidHenkilo))
    }

  } catch (error) {
    log.error('Failed to serve auditlog request', { error })

    return {
      statusCode: 500,
      body: 'internal server error'
    }
  }
}
