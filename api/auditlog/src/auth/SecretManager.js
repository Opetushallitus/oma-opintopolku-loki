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
            reject(error)
          } else {
            const secret = JSON.parse(data.SecretString)
            resolve(secret)
          }
        })
      }
    )
  }

  async authenticateRequest(actualSecret) {
    const expectedSecret = await this._getSecretValue()
    return expectedSecret === actualSecret
  }
}

module.exports = SecretManger