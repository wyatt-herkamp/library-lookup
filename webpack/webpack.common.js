const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const srcDir = path.join(__dirname, "..", "src");


module.exports = {
  entry:  {
    background: path.join(srcDir, "background.ts"),
    contentScript: path.join(srcDir, "contentScript.ts"),
    requires: path.join(srcDir, "requires.ts"),
    options: path.join(srcDir, "options.ts"),
  },
  output: {
    path: path.join(__dirname, "..","dist"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== 'background';
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],

      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "", context: "public",
      transform(content){
        return content.toString().replace(".ts", ".js").replace("../src/", "./").replace("../styles","./styles").replace(".scss", ".css");
      }}],
      options: {},
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
};
