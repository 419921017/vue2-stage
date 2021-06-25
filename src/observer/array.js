/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-21 20:23:55
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-21 20:50:04
 */
const oldArrayPrototype = Array.prototype;
const arrayMethods = Object.create(oldArrayPrototype);

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse',
  'sort',
];

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    oldArrayPrototype[method].call(this, ...args);
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshfit':
        inserted = args; // 就是新增的内容
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // 数组的observe.dep
    ob.dep.notify();
  };
});

export default arrayMethods;
