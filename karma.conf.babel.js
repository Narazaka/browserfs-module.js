import webpack_config from './webpack.config.js';
import path from 'path';

module.exports = (config) =>
  config.set({
    basePath: '',
    frameworks: ['detectBrowsers', 'mocha'],
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-own-reporter',
      'karma-ie-launcher',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-electron',
      'karma-safari-launcher',
      'karma-opera-launcher',
      'karma-detect-browsers',
      'karma-coverage',
    ],
    files: [
//      'mock/browser-global-vars.js',
      require.resolve('mocha-lazy-bdd/dist/mocha-lazy-bdd'),
      'mock/mocha-lazy-bdd.js',
//      'node_modules/power-assert/build/power-assert.js',
//      'src/**/*.js',
      'test/**/*.js',
    ],
    exclude: ['**/*.swp'],
    preprocessors: {
//      'src/**/*.js': ['webpack', 'coverage'],
      'test/**/*.js': ['webpack'],
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: webpack_config.module.loaders,
        postLoaders: [
          {
            test: /\.js$/,
            include: path.resolve('./src/'),
            loader: 'istanbul-instrumenter'
          },
        ],
      },
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: ['babel-plugin-espower'],
        sourceMap: true,
      },
      filename: (file) => file.originalPath.replace(/\.js$/, '.es5.js'),
      sourceFileName: (file) => file.originalPath,
    },
    coverageReporter: {
      reporters: [{type: 'lcov'}],
      instrumenters: {isparta: require('isparta')},
      instrumenter: {
        '**/*.js': 'isparta',
      },
      instrumenterOptions: {
        isparta: {
          babel: {
            presets: ['power-assert'],
            sourceMap: true,
          },
        },
      },
    },
    reporters: ['mocha-own', 'coverage'],
    detectBrowsers: {
      postDetection: function(availableBrowsers) {
        const result = availableBrowsers;
        if (process.env.TRAVIS) {
          const chrome_index = availableBrowsers.indexOf('Chrome');
          if (chrome_index >= 0) {
            result.splice(chrome_index, 1);
            result.push('Chrome_travis_ci');
          }
        }
        const phantom_index = availableBrowsers.indexOf('PhantomJS');
        if (phantom_index >= 0) result.splice(phantom_index, 1);
        result.push('Electron');
        return result;
      },
    },
    customLaunchers: {
      Chrome_travis_ci: {
         base: 'Chrome',
         flags: ['--no-sandbox'],
       },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,
    concurrency: Infinity,
  });
