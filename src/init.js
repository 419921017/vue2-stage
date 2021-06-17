/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:24:30
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-17 21:30:25
 */

import { initState } from "./state";

/**
 *
 * 在Vue的基础上做一次混合操作
 * @export
 * @param {*} Vue
 */
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // console.log("options", options);
    const vm = this;
    vm.$options = options;
    initState(vm);
  };
}
