/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');

module.exports = {
  entry: {
    renderer: path.resolve(__dirname, '..', './src', 'entry', 'main.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', './dist'),
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.js'],
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
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
