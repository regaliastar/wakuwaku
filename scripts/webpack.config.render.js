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
    },
  },
  module: {
    rules: [
      {
        // 同时匹配 ts，tsx 后缀的 TypeScript 源码文件
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  devtool: 'source-map',
};
