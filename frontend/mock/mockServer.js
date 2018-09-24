const jsonServer = require('json-server')
const path = require('path')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'api.json'))
const middlewares = jsonServer.defaults()
const organizations = require('./mockOrganizations')

const MOCK_API_PORT = 3000

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use(jsonServer.rewriter({
  '/organisaatio/v4/findbyoids': '/organizations'
}))

server.post('/organizations', (req, res) => {
  const oids = req.body

  if (!Array.isArray(oids) || oids.length === 0) {
    return res.status(500).send('Check req body')
  }

  res.json(
    Object.entries(organizations).filter(([k, _]) => oids.includes(k)).map(([_, v]) => v)
  )
})

server.use(router)

server.listen(MOCK_API_PORT, () => {
  console.log(`Mock API is running at port ${MOCK_API_PORT}`)
})
