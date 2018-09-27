const AWS = require('aws-sdk')
const config = require('config');

const SecretManager = require('../../../common/src/auth/SecretManager')
const UserClient = require('../../../common/src/client/UserClient')

const secretManager = new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))
const userClient = new UserClient(
  config.get('backend.timeout'),
  config.get('backend.host'),
  config.get('secret.name')
)

module.exports = async (event, context) => {
  try {
    const { secret, hetu, oid } = event.headers
    console.log(JSON.stringify({message: `Received whoami request for ${oid}`}))

    const isAuthenticated = await secretManager.authenticateRequest(secret)

    if (!isAuthenticated) return {
      statusCode: 401,
      body: JSON.stringify({message: 'Not authenticated'})
    }

    const user = await userClient.getUser(hetu)

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': `max-age=${config.get('cache.max-age')}`
      },
      body: JSON.stringify(user)
    }

  } catch (err) {
    console.log('Failed', err)

    return {
      statusCode: 500,
      body: 'internal server error'
    }
  }
}
