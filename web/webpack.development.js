const path = require("path")
const common = require("./webpack.common.js")
const merge = require("webpack-merge")

module.exports = merge.multiple(common, {
  client: {
    mode: "development",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
      sockPort: 4001,
      historyApiFallback: true,
    },
  },
})
