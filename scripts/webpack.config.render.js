/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');

module.exports = {
  entry: {
    renderer: path.resolve(__dirname, '..', './src', 'entry', 'main.tsx'),
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, '..', './dist'),
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      '~page': path.resolve(__dirname, '..', './src', './page'),
      '~util': path.resolve(__dirname, '..', './src', './common', './util'),
      '~store': path.resolve(__dirname, '..', './src', './common', './store'),
      '~interface': path.resolve(__dirname, '..', './src', './common', './interface'),
      '~component': path.resolve(__dirname, '..', './src', './common', './component'),
      '~style': path.resolve(__dirname, '..', './src', './common', './style'),
      '~statics': path.resolve(__dirname, '..', './statics'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  devtool: 'source-map',
};
