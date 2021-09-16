const commonConfig = require('./common.config');

module.exports = Object.assign(commonConfig,{
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
      contentBase :'./dist',
      historyApiFallback: true
  }
});