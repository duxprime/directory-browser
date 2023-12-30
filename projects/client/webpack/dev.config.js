const commonConfig = require('./common.config');

module.exports = Object.assign(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    contentBase: './dist',
    hot: true,
    historyApiFallback: true
  }
});