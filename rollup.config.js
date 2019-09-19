import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";

export default {
  input: "./lib/index.js",
  output: [
    {
      file: "./dist/vue-typescript-inject.js",
      format: "cjs",
      exports: "named"
    },
    {
      file: "./dist/vue-typescript-inject.esm.js",
      format: "esm",
      exports: "named"
    }
  ],
  plugins: [resolve(), commonjs(), cleanup({ comments: "none" })],
  external: ["vue-class-component"]
};
