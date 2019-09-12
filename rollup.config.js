import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";

export default {
  input: "./lib/index.js",
  output: [
    {
      file: "./dist/vue-typescript-inject.js",
      format: "cjs"
    },
    {
      file: "./dist/vue-typescript-inject.esm.js",
      format: "esm"
    }
  ],
  plugins: [resolve(), commonjs(), cleanup({ comments: "none" })],
  external: ["vue-class-component"]
};
