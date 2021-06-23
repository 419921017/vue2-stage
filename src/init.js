/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:24:30
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-23 21:19:06
 */

import { compileToFunction } from "./compiler";
import { mountComponent } from "./lifecycle";
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

    if (vm.$options.el) {
      // 将数据挂在模板上
      vm.$mount(vm.$options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        console.log("el", el);
        template = el.outerHTML;
        let render = compileToFunction(template);
        options.render = render;
      }
    }
    console.log(options.render);
    // 组件的挂载流程
    mountComponent(vm, el);
  };
}
