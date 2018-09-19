/**
 * Oppija-raamit interface requires three functions (getUser, login, logout) under global Service object.
 * @type {{
 *  getUser: function: Promise<Object>,
 *  login: function: void,
 *  logout: function: void
 * }}
 */
window.Service = {
  // eslint-disable-next-line no-undef
  getUser: () => fetch(`${process.env.API_BASE_URL}/user`).then(v => v.json()),
  login: () => { throw new Error('Not implemented') },
  logout: () => { throw new Error('Not implemented') }
}
