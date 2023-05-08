const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  context: path.resolve(__dirname, '..', './src'),
  mode: process.env.NODE_ENV,
  entry: {
    contentScript: './contentScript.ts',
    requires: './requires.ts',
    'options/index': './options/index.ts',
    'popup/index': './popup/index.ts',
    background: './background.ts',
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue: '@vue/runtime-dom',
    },
    modules: ['node_modules'],
  },
  target: ['web'],

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APP_NAME: JSON.stringify('Library Lookup'),
        REPO_ENV: JSON.stringify(process.env.REPO_ENV),
      },
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
    }),
    new VueLoaderPlugin(), // for Vue3

    new CopyPlugin({
      patterns: [
        {
          from: '../public',
          to: '',
        },
        {
          from: './popup/index.html',
          to: './popup/index.html',
          transform: {
            cache: true,
          },
        },
        {
          from: './options/index.html',
          to: './options/index.html',
          transform: {
            cache: true,
          },
        },
      ],
      options: {},
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
};
