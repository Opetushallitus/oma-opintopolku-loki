import http from 'http/http'

/**
 * Oppija-raamit interface requires three functions (getUser, login, logout) under global Service object.
 * @type {{
 *  getUser: function: Promise<Object>,
 *  login: function: void,
 *  logout: function: void
 * }}
 */
window.Service = {
  getUser: () => http.get(`${process.env.API_BASE_URL}/user`).then(v => v.data),
  login: () => { throw new Error('Not implemented') },
  logout: () => { throw new Error('Not implemented') }
}
