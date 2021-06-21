import { observe } from "./observer";
import { isFunction } from "./utils";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:29:52
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-21 20:10:58
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

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  for (const key in data) {
    proxy(vm, "_data", key);
  }
  // console.log("initData", data);
  observe(data);
}
