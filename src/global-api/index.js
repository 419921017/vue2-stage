import { mergeOptions } from "../utils";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-28 21:05:53
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-28 22:13:31
 */
export function initGlobalApi(Vue) {
  // 用来存储全局配置
  // 每个组件初始化的时候都会和options选项进行合并
  Vue.options = {};
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
  };
}
