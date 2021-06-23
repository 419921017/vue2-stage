/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-23 21:31:22
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-23 21:35:54
 */
export function createElement(vm, tag, data = {}, ...children) {
  return vnode(vm, tag, data, data.key, children, undefined);
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, data, key, children, text) {
  return { vm, tag, data, key, children, text };
}
