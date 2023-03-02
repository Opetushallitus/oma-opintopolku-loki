require('dotenv').config()

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

const raamitProxy = {
  '/oppija-raamit': {
    target: process.env.RAAMIT_DEV_PROXY_TARGET,
    secure: false
  }
}

const apiProxy = {
  '/koski/api/omaopintopolkuloki/auditlogs': {
    target: 'http://localhost:3000',
    secure: false
  },
  '/koski/api/omaopintopolkuloki/whoami': {
    target: 'http://localhost:3000',
    secure: false
  }
}

module.exports = merge(common, {
  mode: 'development',
  resolve: {
    alias: {
      Resources: path.resolve(__dirname, 'mock') // dependency-inject mocks to the aliased resources module
    }
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    proxy: process.env.PROXY_OPPIJA_RAAMIT === 'true' ? { ...raamitProxy, ...apiProxy } : apiProxy
  },
  devtool: 'eval-source-map'
})
