const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const vars = require('./variables');

module.exports = {
  entry: {
    main: './src/index.ts',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  plugins: [
    new HtmlWebpackPlugin(Object.assign({}, vars, {
      template: path.resolve(__dirname, '..', 'src', 'index.ejs'),
      filename: 'index.html',
    }))
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          esModule: false
        }
      },
      {
        test: /\.ejs$/i,
        loader: 'ejs-loader',
        options: {
          esModule: false
        }
      }
    ]
  }
};