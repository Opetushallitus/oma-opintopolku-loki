import http from 'http/http'

export const parseUserName = user => `${user.etunimet} ${user.sukunimi}`

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
      name: parseUserName(user)
    })),
  login: () => { throw new Error('Not implemented') },
  logout: () => { window.location.assign('/cas-oppija/logout?service=/oma-opintopolku/') }
}
