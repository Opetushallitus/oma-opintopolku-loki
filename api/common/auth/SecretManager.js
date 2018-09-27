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
            reject(error)
          } else {
            resolve(JSON.parse(data.SecretString))
          }
        })
      }
    )
  }

  async authenticateRequest(actualSecret) {
    const { expectedSecret } = await this.getSecretValue()

    if (actualSecret === null || typeof actualSecret === 'undefined') return false
    if (expectedSecret === null || typeof expectedSecret === 'undefined') return false

    return expectedSecret === actualSecret
  }
}

module.exports = SecretManger
