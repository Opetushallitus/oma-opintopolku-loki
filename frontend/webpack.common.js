const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')


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
          'babel-loader'
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
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      emitWarning: false,
      failOnWarning: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      title: 'Oma opintopolku - tietojeni käyttö'
    }),
    new webpack.EnvironmentPlugin(
      { RAAMIT_DEV_PROXY_TARGET: 'https://testiopintopolku.fi' }
    )
  ]
}
