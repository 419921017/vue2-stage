/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-23 21:31:22
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-23 21:35:54
 */

import { isObject, isReservedTag } from '../utils';

/**
 *
 *
 * @export
 * @param {*} vm
 * @param {*} tag 标签名, 组件名
 * @param {*} [data={}]
 * @param {*} children
 * @return {*}
 */
export function createElement(vm, tag, data = {}, ...children) {
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children, undefined);
  } else {
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor);
  }
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

/**
 * 创建组件的组件的虚拟节点
 *
 * @export
 * @param {*} vm
 * @param {*} tag
 * @param {*} data
 * @param {*} key
 * @param {*} children
 * @param {*} Ctor
 *
 * 1. 给组件创建一个构造函数, 基于Vue
 * 2. 开始生成虚拟节点, 对组件进行特殊处理, data.hook = { init() {} }
 * 3. 生成dom节点, 如果当前虚拟节点有hook.init属性, 说明是组件
 * 4. 对自己进行new 组件().$mount() => vm.$el, 将组件对应的真实节点挂载到实例的$el上
 * 5. 将组件的$el插入到父容器中(父组件)
 */
export function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }

  // 渲染组件时需要调用该初始化方法
  data.hook = {
    init(vnode) {
      let vm = (vnode.componentInstance = new Ctor({ _isComponent: true }));
      // 组件挂载完成后, vm.$el => 真实节点, vm.$el对应的是组件的真实dom
      vm.$mount();
    },
  };

  return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
    Ctor,
    children,
  });
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return { vm, tag, data, key, children, text, componentOptions };
}
