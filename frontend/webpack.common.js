const webpack = require('webpack')
const path = require('path')

const assertEnvVariableIsDefined = variable => {
  const v = process.env[variable]

  if (v === undefined) {
    throw new Error(`${variable} environment variable is undefined.`)
  }

  return v
}

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'resources')
    ],
    alias: {
      /*
      This alias is overridden per environment to conditionally use mocks instead of actual resources.
      I.e. when importing a resource, use this alias if build-time dependency injection is wanted,
      otherwise use the actual module.
       */
      Resources: path.resolve(__dirname, 'resources')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(assertEnvVariableIsDefined('API_BASE_URL'))
    })
  ]
}
