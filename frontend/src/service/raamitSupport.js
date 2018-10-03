import http from 'http/http'
import { isEmpty } from 'ramda'

const parseUserName = user => {
  const firstName = user.kutsumanimi && !isEmpty(user.kutsumanimi) ? user.kutsumanimi : user.etunimet
  const lastName = user.sukunimi

  return `${firstName} ${lastName}`
}

/**
 * Oppija-raamit interface requires three functions (getUser, login, logout) under global Service object.
 * @type {{
 *  getUser: function: Promise<Object>,
 *  login: function: void,
 *  logout: function: void
 * }}
 */
window.Service = {
  getUser: () => http.get('whoami')
    .then(v => v.data)
    .then(user => ({
      name: parseUserName(user),
      oid: user.oidHenkilo
    })),
  login: () => { throw new Error('Not implemented') },
  logout: () => { window.location.href = '/shibboleth/Logout?return=/oma-opintopolku/' }
}
