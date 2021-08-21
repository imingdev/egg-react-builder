const path = require('path');

exports.builder = {
  dev: false,
  env: {},
  build: {
    publicPath: '/',
    dir: {
      manifest: 'manifest.json',
      server: 'server/views',
      static: 'static',
    },
    alias: {
      '@': path.join(process.cwd(), 'client'),
    },
    watch: {
      aggregateTimeout: 1000,
    },
    // config, {isDev, isClient, isServer}
    extend: config => config,
    filenames: {
      // { isDev, isClient, isServer }
      app: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash:8].js'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash:8].js'),
      css: ({ isDev }) => (isDev ? '[name].css' : 'css/[contenthash:8].css'),
      img: ({ isDev }) => (isDev ? '[path][name].[ext]' : 'images/[contenthash:8].[ext]'),
      font: ({ isDev }) => (isDev ? '[path][name].[ext]' : 'fonts/[contenthash:8].[ext]'),
      video: ({ isDev }) => (isDev ? '[path][name].[ext]' : 'videos/[contenthash:8].[ext]'),
      cssModulesName: ({ isDev }) => (isDev ? '[name]__[local]--[hash:base64:5]' : '_[hash:base64:10]'),
    },
    useEslint: true,
  },
  dir: {
    root: process.cwd(),
    src: 'client',
    page: 'pages',
    build: 'dist',
  },
  pattern: '**/index.{js,jsx}',
  globals: {
    id: 'app-main',
    context: 'window.__INITIAL_STATE__',
  },
};

