const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  client: {
    entry: "./src/client/index",
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      filename: "client.bundle.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json", ".scss", ".css"],
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
        {
          test: /\.module\.s?css$/,
          loader: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            {
              loader: "sass-loader",
            },
          ],
        },
        {
          test: /\.s?css$/,
          exclude: /\.module.s?css$/,
          loader: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin(["API_URL"]),
      new HtmlWebpackPlugin({
        title: "NPC's chat app",
        template: path.join(__dirname, "src", "index.dev.ejs"),
      }),
    ],
  },
}
