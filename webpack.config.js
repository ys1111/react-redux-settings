/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  devtool: 'cheap-eval-source-map',
  entry: [
    // activate HMR for React
    'react-hot-loader/patch',

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:8080',

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',

    './app.js',

    './assets/cssnext/Entry/entry.css'
  ],

  output: {
    path: path.join(__dirname, '../server/public'),
    filename: 'bundle.js',
  },

  context: path.join(__dirname, 'src'),

  devServer: {

    // enable HMR on the server
    hot: true,
    historyApiFallback: true,
    noInfo: true,
    open: true,

    // match the output path
    contentBase: path.join(__dirname, '../server/public'),

    // match the output `publicPath`
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          cacheDirectory: true,
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          {
            loader: ['css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]&importLoaders=1!postcss-loader'],
            exclude: /node_modules/,
          }
        ),
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[hash].[ext]'
        }
      },
      {
        test: /\.(gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },

  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),


    // export css name
    new ExtractTextPlugin('[name].bundle.css'),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('postcss-import')(),
          require('postcss-cssnext')({browsers: ['last 2 versions', '> 5%']}),
        ]
      }
    }),
  ]
};
