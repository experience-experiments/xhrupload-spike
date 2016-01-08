/* eslint-env node */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'tmp'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      'GATEWAY_URL': JSON.stringify('http://localhost:3000')
    })
  ],
  module: {
    loaders: [
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.js$/, loader: 'babel', query: { presets: ['react', 'es2015']}, include: path.join(__dirname, 'src')},
      { test: /\.(woff)$/, loader: 'url-loader?limit=8192' }
    ]
  },
  devtool: 'eval'
};
