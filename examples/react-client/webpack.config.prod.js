/* eslint-env node */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    sourceMapFilename: '[file].map'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.js$/, loader: 'babel', query: { presets: ['react', 'es2015']}, include: path.join(__dirname, 'client')},
      { test: /\.(woff)$/, loader: 'url-loader?limit=8192' }
    ]
  },
  devtool: 'source-map'
};
