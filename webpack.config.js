const path = require("path");

module.exports = {
  mode: "development",
  entry: "./lib/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vue-typescript-inject.js",
    library: "vue-typescript-inject",
    libraryTarget: "umd"
  },
  externals: ["vue", "vue-class-component"]
};
