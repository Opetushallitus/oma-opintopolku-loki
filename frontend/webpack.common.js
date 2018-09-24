const webpack = require('webpack')
const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      'node_modules',
      path.resolve('./src'),
      path.resolve('./resources')
    ]
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
    new webpack.EnvironmentPlugin({
      API_BASE_URL: '',
      ORGANISAATIO_SERVICE_BASE_URL: ''
    })
  ]
}
