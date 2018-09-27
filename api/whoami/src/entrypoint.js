const AWS = require('aws-sdk')
const config = require('config')
const log = require('lambda-log')
const deepOmit = require('omit-deep-lodash')

const SecretManager = require('../../common/src/auth/SecretManager')
const UserClient = require('../../common/src/client/UserClient')

const secretManager = new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))

module.exports.handler = async (event, context, callback) => {

  try {
    log.options.meta = { event: { ...context, ...deepOmit(event, 'secret', 'hetu') } }

    const { secret, hetu, oid } = event.headers

    if (!secret || !hetu || !oid) {
      log.info(`Received whoami request without headers`)
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing headers' })
      })
    }

    log.info(`Received whoami request for ${oid}`)

    const isAuthenticated = await secretManager.authenticateRequest(secret)

    if (isAuthenticated) {

      const userClient = new UserClient(
        config.get('backend.timeout'),
        config.get('backend.host'),
        config.get('secret.name')
      )

      const user = await userClient.getUser(hetu)

      callback(null, {
        statusCode: 200,
        headers: {
          'Cache-Control': 'max-age=600'
        },
        body: JSON.stringify(user)
      })
    } else {
      log.info(`Unauthorized request`)
      callback(null, {
        statusCode: 401,
        body: JSON.stringify({ message: 'Not authenticated' })
      })

    }
  } catch (error) {
    log.error(`Response failed`, { error })
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    })
  }
}
