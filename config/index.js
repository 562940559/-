// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    // sitEnv: require('./prod.env'),
    // testEnv: require('./dev.env'),
    index: path.resolve(__dirname, '../jade/index.html'),
    assetsRoot: path.resolve(__dirname, '../jade'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    cssSourceMap: false,
  },
  dev: {
    env: require('./dev.env'),
    port: 8009,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/app/': {
        target: 'http://tfxq.aiaudit.cn:9005',
        changeOrigin: true,
        pathRewrite: {
          '^/app':'/app'
        },
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
