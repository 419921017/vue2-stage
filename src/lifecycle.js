/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-23 21:18:30
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-28 22:08:56
 */

import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";
import { nextTick } from "./utils";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
  Vue.prototype.$nextTick = nextTick;
}

export function mountComponent(vm, el) {
  // 更新函数, 数据变化后会再次调用
  let updateComponent = () => {
    // 调用render函数, 生成虚拟dom
    vm._update(vm._render());
    // 用虚拟dom生成真实dom
  };
  callHook(vm, "beforeMount");
  // updateComponent();
  // true表示这是一个渲染watcher
  // 每个组件都对一个渲染watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log("udpate");
    },
    true
  );
}

export function callHook(vm, hook) {
  vm.$options[hook] && vm.$options[hook].forEach((fn) => fn.call(vm));
}
