const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: ["./test/test.js"],
  output: {
    path: __dirname,
    filename: "test.build.js"
  },
  externals: [nodeExternals()]
};
