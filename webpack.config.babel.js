import webpack from 'webpack'
import path from 'path'

const config = {
  entry: [
    './client/init.js'
  ],
  output: {
    path: path.join(__dirname, 'build/public/bundle'),
    publicPath: '/bundle',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  }
}

if (process.env.NODE_ENV === 'development') {
  config.module.loaders[0].loaders.unshift('react-hot')
  config.devtool = 'eval'
  config.cache = true
  config.entry = [
    `webpack-dev-server/client?http://0.0.0.0:${process.env.WEBPACK_PORT}`,
    'webpack/hot/only-dev-server'
  ].concat(config.entry)
  config.module.loaders[0].loaders.splice(0, 0, 'react-hot')
}
else if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map'
  config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}

const swConfig = {
  entry: [
    './client/sw.js'
  ],
  output: {
    path: path.join(__dirname, 'build/public/bundle'),
    publicPath: '/bundle',
    filename: 'sw.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  }
}

module.exports = [config, swConfig]
