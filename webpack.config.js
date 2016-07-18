var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
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
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),
    new webpack.DefinePlugin({
      'process': {
        execPath: "'/node'",
        env: "{}",
      },
      'NativeModule._source': "{}",
    }),
    new webpack.optimize.DedupePlugin(),
//    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  resolve: {
    root: [
      path.join(__dirname, "bower_components"),
    ],
  },
  externals: [
    {
      browserfs: 'BrowserFS',
    }
  ],
};
