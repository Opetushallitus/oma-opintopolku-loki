require('dotenv').config()

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const http = require('http')

const KOSKI_BASE = 'http://localhost:7021'

module.exports = merge(common, {
  mode: 'development',
  resolve: {
    alias: {
      Resources: path.resolve(__dirname, 'resources')
    }
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    proxy: [
      {
        context: ['/koski/api/omaopintopolkuloki'],
        target: KOSKI_BASE,
        secure: false
      }
    ],
    setupMiddlewares: (middlewares, devServer) => {
      // GET /mock-login/:hetu — authenticates against Koski's mock CAS and sets the session cookie
      devServer.app.get('/mock-login/:hetu', (req, res) => {
        const hetu = req.params.hetu
        const options = {
          hostname: 'localhost',
          port: 7021,
          path: '/koski/cas/oppija',
          method: 'GET',
          headers: {
            hetu: hetu,
            security: 'mock'
          }
        }

        const casReq = http.request(options, (casRes) => {
          const cookies = casRes.headers['set-cookie'] || []
          cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie))
          res.redirect('/')
        })

        casReq.on('error', (err) => {
          res.status(502).send(
            `Could not reach Koski at ${KOSKI_BASE} — is it running? (make run)\n\n${err.message}`
          )
        })

        casReq.end()
      })

      return middlewares
    }
  },
  devtool: 'eval-source-map'
})
