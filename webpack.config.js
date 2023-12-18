//@ts-check

'use strict';

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  mode: 'development',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: { path: require.resolve('path-browserify') },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log',
  },
};

// Configuration for bundling the React webview logic
const webviewConfig = {
  target: 'web', // Important: This configures the environment for browsers
  entry: './src/Webview.tsx', // Entry point for your React webview
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webview.js', // Output file for the webview script
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these file extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_CLERK_PUBLISHABLE_KEY': JSON.stringify(
        process.env.REACT_APP_CLERK_PUBLISHABLE_KEY
      ),
    }),
  ],
  devtool: 'source-map',
};
module.exports = [extensionConfig, webviewConfig];
