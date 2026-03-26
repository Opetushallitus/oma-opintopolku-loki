import http from 'http/http'

export const parseUserName = user => `${user.etunimet} ${user.sukunimi}`
export const nav = { assign: url => window.location.assign(url) }

/**
 * Oppija-raamit interface requires three functions (getUser, login, logout) under global Service object.
 * @type {{
 *  getUser: function: Promise<Object>,
 *  login: function: void,
 *  logout: function: void
 * }}
 */
window.Service = {
  getUser: () => http.get('/koski/api/omaopintopolkuloki/whoami')
    .then(v => v.data)
    .then(user => ({
      name: parseUserName(user)
    })),
  login: () => { nav.assign('/oma-opintopolku/authenticate') },
  logout: () => { nav.assign('/koski/user/logout?target=/oma-opintopolku') }
}
