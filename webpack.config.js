var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },
  entry: {
    'browserfs-module': './src/module.js',
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    publicPath: '/',
    library: 'browserfsModule',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process': {
        execPath: "'/node'",
        env: "{}",
      },
      'NativeModule._source': "{}",
    }),
//    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  externals: [
    {
      browserfs: {
        root: 'BrowserFS',
        commonjs: 'browserfs',
        commonjs2: 'browserfs',
        amd: 'browserfs',
      },
    }
  ],
};
