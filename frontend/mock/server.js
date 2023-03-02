const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('mock/api.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(jsonServer.bodyParser)

server.use(transformPostRequestToGet)
server.use(jsonServer.rewriter({
  "/koski/api/omaopintopolkuloki/*": "/$1",
  "/auditlogs/010280-952L": "/auditlogs",
  "/auditlogs/010290-911K": "/auditlogs-huollettava"
}))

server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running')
})

function transformPostRequestToGet(req, res, next) {
  if (req.method === 'POST') {
    const hetu = req.body?.hetu || ''
    req.method = 'GET'
    req.url = req.url + hetu
  }
  next()
}
