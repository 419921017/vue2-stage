import { mergeOptions } from '../utils';

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
  // 后续无论创建多少个子类, 都可以通过_base找到Vue
  Vue.options._base = Vue;
  Vue.options.components = {};
  Vue.component = function (id, definition) {
    // 保证组件的隔离, 每个组件都要创建一个新类, 继承父类
    definition = this.options._base.extend(definition);
    this.options.components[id] = definition;
  };

  // 产生一个继承Vue的类
  Vue.extend = function (opts) {
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    // 只和Vue的options合并
    Sub.options = mergeOptions(Super.options, opts);

    return Sub;
  };
}
