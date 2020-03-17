const path = require("path")
const common = require("./webpack.common.js")
const merge = require("webpack-merge")

module.exports = merge.multiple(common, {
  client: {
    mode: "production",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[hash].js",
    },
  },
  server: {
    entry: "./src/server/index",
    target: "node",
    mode: "production",
    output: {
      path: __dirname,
      publicPath: "/",
      filename: "server.bundle.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    node: {
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
            {
              loader: "ts-loader",
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
      ],
    },
  },
})
