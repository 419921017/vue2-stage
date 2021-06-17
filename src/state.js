import { observe } from "./observer";
import { isFunction } from "./utils";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:29:52
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-17 21:51:46
 */
export function initState(vm) {
  console.log("initState", vm.$options);
  const opts = vm.$options;
  // if (opts.props) {
  // }

  // if (opts.methods) {
  // }

  if (opts.data) {
    initData(vm);
  }

  // if (opts.computed) {
  // }

  // if (opts.watch) {
  // }
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  // console.log("initData", data);
  observe(data);
}
