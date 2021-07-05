const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

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
  entry: './src/index.js',
  output: {
    filename: 'main.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      title: 'Oma opintopolku - tietojeni käyttö'
    }),
    new CleanWebpackPlugin(['dist']),
  ]
}
