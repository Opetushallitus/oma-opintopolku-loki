const AWS = require('aws-sdk')
const config = require('config');
const log = require('lambda-log')
const deepOmit = require('omit-deep-lodash')

const SecretManager = require('../../../common/src/auth/SecretManager')
const UserClient = require('../../../common/src/client/UserClient')

const secretManager = new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))
const userClient = new UserClient(
  config.get('backend.timeout'),
  config.get('backend.host'),
  secretManager
)

module.exports = async (event, context) => {
  try {
    log.options.meta = { event: { ...context, ...deepOmit(event, 'security', 'hetu') } }

    const { security, hetu, oid } = event.headers
    log.info(`Received whoami request for ${oid}`)

    if (!security || !hetu) {
      log.info(`Received whoami request without headers`)
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing headers' })
      }
    }

    const isAuthenticated = await secretManager.authenticateRequest(security)

    if (!isAuthenticated) {
      log.info(`Unauthorized request`)
      return {
        statusCode: 401,
        body: JSON.stringify({message: 'Not authenticated'})
      }
    }

    const user = await userClient.getUser(hetu)

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': `private, max-age=${config.get('cache.max-age')}`
      },
      body: JSON.stringify(user)
    }

  } catch (error) {
    log.error(`Response failed`, { error })

    return {
      statusCode: 500,
      body: 'internal server error'
    }
  }
}
