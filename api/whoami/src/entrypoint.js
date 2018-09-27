const AWS = require('aws-sdk')
const config = require('config');

const SecretManager = require('../../common/auth/SecretManager')
const UserClient = require('../../common/UserClient')

const secretManager = new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))

module.exports.handler = async (event, context, callback) => {

  try {
    const { secret, hetu, oid } = event.headers
    console.log(JSON.stringify({message: `Received whoami request for ${oid}`}))

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

      callback(null, {
        statusCode: 401,
        body: JSON.stringify({message: 'Not authenticated'})
      })

    }
  } catch (err) {
    console.log('Failed', err)
  }
}
