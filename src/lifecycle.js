/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-23 21:18:30
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-23 21:24:15
 */

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    console.log("_update");
  };
}

export function mountComponent(vm, el) {
  // 更新函数, 数据变化后会再次调用
  let updateComponent = () => {
    // 调用render函数, 生成虚拟dom
    vm._update(vm._render());
    // 用虚拟dom生成真实dom
  };
  updateComponent();
}
