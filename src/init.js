/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:24:30
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-28 22:12:29
 */

import { compileToFunction } from './compiler';
import { callHook, mountComponent } from './lifecycle';
import { initState } from './state';
import { mergeOptions } from './utils';

/**
 *
 * 在Vue的基础上做一次混合操作
 * @export
 * @param {*} Vue
 */
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // vm.constructor.options, 继承的时候不一定是根Vue可能是Vue.extends. 所以要找到构造函数, 找构造函数上的options
    vm.$options = mergeOptions(vm.constructor.options, options);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    if (vm.$options.el) {
      // 将数据挂在模板上
      vm.$mount(vm.$options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    vm.$el = el;
    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
        let render = compileToFunction(template);
        options.render = render;
      }
    }

    // 组件的挂载流程
    mountComponent(vm, el);
  };
}
