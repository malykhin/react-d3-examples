const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const packageData = require('./package.json')

const resolveRoot = (subPath = '') => (
  path.join(__dirname, `src/${subPath}`)
)

const baseConfig = {
  mode: 'development',
  entry: {
    app: [
      'babel-polyfill',
      resolveRoot('index.js')
    ]
  },
  optimization: {
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      'node_modules',
      resolveRoot()
    ]
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'react-d3r',
      template: 'src/assets/index.html',
      version: packageData.version,
      filename: './index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports = webpackMerge(baseConfig, {
    mode: 'production',
    optimization: {
      minimize: true
    },
    plugins: [
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$/
      })
    ]
  })
} else {
  module.exports = webpackMerge(baseConfig, {
    devtool: 'inline-source-map',
    watch: false,
    watchOptions: {
      poll: 1000
    },
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      open: true
    }
  })
}
