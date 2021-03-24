require('dotenv').config()

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const argv = require('yargs').argv

const raamitProxy = {
  '/oppija-raamit': {
    target: process.env.RAAMIT_DEV_PROXY_TARGET,
    secure: false
  }
}

const apiProxy = {
  '/auditlogs': {
    target: 'http://localhost:3000',
    secure: false
  },
  '/whoami': {
    target: 'http://localhost:3000',
    secure: false
  }
}

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify('http://localhost:3000')
    })
  ],
  resolve: {
    alias: {
      Resources: path.resolve(__dirname, 'mock') // dependency-inject mocks to the aliased resources module
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    proxy: argv.proxyOppijaRaamit === 'true' ? { ...raamitProxy, ...apiProxy } : apiProxy
  },
  devtool: 'eval-source-map'
})
