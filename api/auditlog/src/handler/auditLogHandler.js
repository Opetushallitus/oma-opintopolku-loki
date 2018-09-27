const AuditLogs = require('../model/AuditLogs')
const AWS = require('aws-sdk')
const config = require('config');

const SecretManager = require('../../../common/src/auth/SecretManager')
const UserClient = require('../../../common/src/client/UserClient')

const AuditLog = new AuditLogs(new AWS.DynamoDB.DocumentClient())
const secretManager = new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))

const hasRequiredHeaders = ({ headers }) => headers && headers.secret && headers.hetu

module.exports = async (event, context) => {
  try {

    console.log(JSON.stringify({
      message: 'Received an audit log request',
      event,
      context
    }))

    if (!hasRequiredHeaders(event)) {
      return {
        statusCode: 400,
        body: 'missing headers'
      }
    }

    const { hetu, secret } = event.headers

    const userClient = new UserClient(
      config.get('backend.timeout'),
      config.get('backend.host'),
      config.get('secret.name')
    )

    const { oidHenkilo } = await userClient.getUser(hetu)

    const isAuthenticated = await secretManager.authenticateRequest(secret)

    if (!isAuthenticated) {
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

  } catch (e) {

    console.log(JSON.stringify({
      message: `Failed to serve audit log request: ${e.message}`,
      error: e,
      event,
      context
    }))

    return {
      statusCode: 500,
      body: 'internal server error'
    }
  }
}
