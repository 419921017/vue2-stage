/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:07:35
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-17 21:11:09
 */

import babel from "rollup-plugin-babel";

export default {
  input: "./src/index.js",
  output: {
    format: "umd",
    name: "Vue",
    file: "dist/vue.js",
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
