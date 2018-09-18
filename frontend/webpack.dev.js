require('dotenv').config()

const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const argv = require('yargs').argv

const proxy = {
  '/oppija-raamit': {
    target: process.env.RAAMIT_DEV_PROXY_TARGET,
    secure: false
  }
}

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    proxy: argv.proxyOppijaRaamit === 'true' ? proxy : {}
  },
  devtool: 'eval-source-map'
})
