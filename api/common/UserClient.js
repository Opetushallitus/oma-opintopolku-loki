const axios = require('axios')
const cas = require('./cas.js')

class UserClient {
  constructor(timeout, host) {
    this.client = axios.create({
      baseURL: `https://${host}`,
      timeout,
    });

    this.host = host
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

  async getUser(credentials, hetu) {
    try {
      const session = await this.getCasCookie(credentials)
      return this.getOid(hetu, session)
    } catch (err) {
      console.log('Failed to get oid for student', err)
      throw err
    }
  }
}

module.exports = UserClient
