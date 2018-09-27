const log = require('lambda-log')

class SecretManger {
  constructor(manager, secretId) {
    this.manager = manager
    this.secretId = secretId
  }

  getSecretValue() {
    return new Promise(
      (resolve, reject) => {
        const params = { SecretId: this.secretId }
        this.manager.getSecretValue(params, (error, data) => {
          if (error) {
            log.error('Failed to get secret value', { error })
            reject(error)
          } else {
            resolve(JSON.parse(data.SecretString))
          }
        })
      }
    )
  }

  async authenticateRequest(actualSecret) {
    const { shibbolethSecret } = await this.getSecretValue()

    if (actualSecret === null || typeof actualSecret === 'undefined') return false
    if (shibbolethSecret === null || typeof shibbolethSecret === 'undefined') return false

    return shibbolethSecret === actualSecret
  }
}

module.exports = SecretManger
