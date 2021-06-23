import { createElement, createTextElement } from "./vdom";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-23 21:23:10
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-23 21:33:23
 */
export function renderMixin(Vue) {
  Vue.prototype._c = function (tag, data, ...children) {
    // @ts-ignore
    return createElement(this, ...arguments);
  };
  Vue.prototype._v = function (text) {
    return createTextElement(this, text);
  };
  Vue.prototype._s = function (val) {
    return JSON.stringify(val);
  };
  Vue.prototype._render = function () {
    console.log("_render");
    const vm = this;
    let render = vm.$options.render;
    let vnode = render.call(vm);
  };
}
