/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');

module.exports = {
  entry: {
    // main: path.resolve(__dirname, '..', './src', 'main.ts'),
    main: path.resolve(__dirname, '..', './src', './entry', 'main.electron.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', './dist'),
  },
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
