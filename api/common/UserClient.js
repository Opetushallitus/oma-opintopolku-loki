const AWS = require('aws-sdk')
const axios = require('axios')

const cas = require('./cas.js')
const SecretManager = require('./auth/SecretManager')

class UserClient {
  constructor(timeout, host, secret) {
    this.client = axios.create({
      baseURL: `https://${host}`,
      timeout,
    });

    this.host = host
    this.secretManager = new SecretManager(new AWS.SecretsManager(), secret)
  }

  getUrl(hetu) { return `/oppijanumerorekisteri-service/henkilo/henkiloPerusByHetu/${hetu}` }

  getCookieValue(cookie) { return cookie.match(/JSESSIONID=(\w*)/)[1] }

  getOid(hetu, session)  {
    return this.client.get(this.getUrl(hetu), {
      headers: { Cookie: `JSESSIONID=${session};` }
    })
  }

  getCasCookie (credentials) {
    return new Promise((resolve) => {
      cas.withCookie({
        username: credentials.username,
        password: credentials.password,
        hostname: this.host,
        service: 'oppijanumerorekisteri-service',
      }, (resp) => {
        resolve(this.getCookieValue(resp))
      })
    })
  }

  async getCredentials() {
    const jooh = await this.secretManager.getSecretValue()
    console.log(jooh)
  }

  async getUser(credentials, hetu) {
    try {
      this.getCredentials()
      const session = await this.getCasCookie(credentials)
      return this.getOid(hetu, session)
    } catch (err) {
      console.log('Failed to get oid for student', err)
      throw err
    }
  }
}

module.exports = UserClient
