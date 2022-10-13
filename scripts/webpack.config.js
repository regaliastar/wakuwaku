/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '..', './src', 'main.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', './dist'),
  },
  // 内置了 electron 支持
  target: 'electron-main',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
};
