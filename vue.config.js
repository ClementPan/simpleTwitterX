const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isProd = process.env.NODE_ENV === "production"

// ./vue.config.js
module.exports = {
  publicPath: isProd ? './' : './',
  optimization: {
    minimizer: isProd ? [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          },
        }
      })
    ] : []
  }
}