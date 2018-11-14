const AWS = require('aws-sdk')
const config = require('config');
const log = require('lambda-log')
const deepOmit = require('omit-deep-lodash')

const SecretManager = require('../../../common/src/auth/SecretManager')

let secretManager

function cleanShibbolethHeader(value) {
  return value ? Buffer.from(Array.from(value, c => c.charCodeAt(0)), 'utf16le').toString('utf8').trim() : value
}

module.exports = async (event, context) => {
  try {
    log.options.meta = { event: { ...context, ...deepOmit(event, 'security', 'hetu') } }

    const { security, hetu, FirstName: firstName, givenName, sn } = event.headers
    log.info(`Received whoami request`)

    if (!security || !hetu || !firstName || !sn) {
      log.info(`Received whoami request without headers`)
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing headers' })
      }
    }

    secretManager = secretManager || new SecretManager(new AWS.SecretsManager(), config.get('secret.name'))
    const isAuthenticated = await secretManager.authenticateRequest(security)

    if (!isAuthenticated) {
      log.info(`Unauthorized request`)
      return {
        statusCode: 401,
        body: JSON.stringify({message: 'Not authenticated'})
      }
    }

    const user = {hetu, etunimet: cleanShibbolethHeader(firstName), kutsumanimi: cleanShibbolethHeader(givenName), sukunimi: cleanShibbolethHeader(sn)}

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
