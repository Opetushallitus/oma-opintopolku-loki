const log = require('lambda-log')

class SecretManger {
  constructor(manager, secretId) {
    this.manager = manager
    this.secretId = secretId
  }

  _getSecretValue() {
    return new Promise(
      (resolve, reject) => {
        const params = { SecretId: this.secretId }
        this.manager.getSecretValue(params, (error, data) => {
          if (error) {
            log.error(`Failed to get secret: ${error.message}`, { error })
            reject(error)
          } else {
            const secret = JSON.parse(data.SecretString)
            resolve(secret.shibbolethSecret)
          }
        })
      }
    )
  }

  async authenticateRequest(actualSecret) {
    const expectedSecret = await this._getSecretValue()

    if (actualSecret === null || typeof actualSecret === 'undefined') return false
    if (expectedSecret === null || typeof expectedSecret === 'undefined') return false

    return expectedSecret === actualSecret
  }
}

module.exports = SecretManger
