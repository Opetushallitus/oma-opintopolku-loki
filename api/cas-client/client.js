const axios = require('axios')
const config = require('config');
const cas = require('./cas.js')

const client = axios.create({
  baseURL: config.get('backend.url'),
  timeout: config.get('backend.timeout'),
});

const url = (hetu) => `/oppijanumerorekisteri-service/henkilo/henkiloPerusByHetu/${hetu}`
const getCookieValue = (cookie) => cookie.match(/JSESSIONID=(\w*)/)[1]

const getOid = (hetu, session) => {
  return client.get(url(hetu), {
    headers: { Cookie: `JSESSIONID=${session};` }
  })
}

const getCasCookie = (credentials) => {
  return new Promise((resolve) => {
      cas.withCookie({
        username: credentials.username,
        password: credentials.password,
        hostname: config.get('backend.host'),
        service: 'oppijanumerorekisteri-service',
      }, (resp) => {
        resolve(getCookieValue(resp))
      })
  })
}

const getUser = async (credentials, hetu) => {
  try {
    const session = await getCasCookie(credentials)
    return getOid(hetu, session)
  } catch (err) {
    console.log('Failed to get oid for student', err)
    throw err
  }
}

module.exports = getUser

