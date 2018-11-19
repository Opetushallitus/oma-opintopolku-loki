const AWS = require('aws-sdk')
const axios = require('axios')
const config = require('config')

const cas = require('./cas.js')

class UserClient {
  constructor(timeout, host, secretManager) {
    this.client = axios.create({
      baseURL: `https://${host}`,
      timeout,
      headers: {
        'Caller-Id': config.get('backend.callerId')
      }
    });

    this.host = host
    this.secretManager = secretManager
  }

  getUrl(hetu) { return `/oppijanumerorekisteri-service/henkilo/henkiloPerusByHetu/${hetu}` }

  getCookieValue(cookie) { return cookie.match(/JSESSIONID=(\w*)/)[1] }

  getOid(hetu, session)  {
    return this.client.get(this.getUrl(hetu), {
      headers: { Cookie: `JSESSIONID=${session};` }
    })
  }

  async getCasCookie() {
    const { username, password } = await this.secretManager.getSecretValue()
    return new Promise((resolve) => {
      cas.withCookie({
        username,
        password,
        hostname: this.host,
        service: 'oppijanumerorekisteri-service',
      }, (resp) => {
        resolve(this.getCookieValue(resp))
      })
    })
  }

  async getUser(hetu) {
    if (hetu === null || typeof hetu === 'undefined') throw new Error("Cannot get OID for null hetu")

    try {
      const session = await this.getCasCookie()
      const response = await this.getOid(hetu, session)
      return response.data
    } catch (err) {
      console.log('Failed to get oid for student', err)
      throw err
    }
  }
}

module.exports = UserClient
