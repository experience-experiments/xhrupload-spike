/* eslint-env node */

module.exports = (config) => {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    port: 8080,
    captureTimeout: 60000,
    files: [
      './test/index.js'
    ],
    frameworks: ['phantomjs-shim', 'mocha', 'chai'],
    singleRun: true,
    reporters: ['dots'],
    preprocessors: {
      './test/index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      module: {
        loaders: [
          { test: /\.scss$/, loader: 'null-loader' },
          { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
          { test: /\.(woff)$/, loader: 'null-loader' }
        ]
      },
      devtool: 'inline-source-map'
    },
    webpackServer: {
      noInfo: true
    },
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-phantomjs-launcher'),
      require('karma-phantomjs-shim')
    ]
  });
};
