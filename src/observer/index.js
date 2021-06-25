import { isArray, isObject } from '../utils';
import arrayMethods from './array';
import Dep from './dep';

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:38:12
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 21:10:10
 */

// 给对象新增一个属性, 不会触发更新, 可以通过$set, 给对象本身增加一个dep, dep存watcher, 如果增加一个属性后, 手动触发watcher
class Observer {
  constructor(data) {
    this.dep = new Dep();
    // 给对象和数组添加一个自定义属性
    // __ob__ 会造成死循环
    Object.defineProperty(data, '__ob__', {
      value: this,
      // 这属性不能被枚举, 无法被循环到
      enumerable: false,
    });
    // data.__ob__ = this;
    if (isArray(data)) {
      // 重写数组方法
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  // 递归遍历数组, 对数组内部的对象再次进行重写[[]] [{}]
  observeArray(data) {
    // 数组里面如果是引用类型, 继续进行observe, 响应式
    data.forEach((item) => observe(item));
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

/**
 * 数组的子元素还是数组的情况
 *
 * @param {*} value
 */
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const current = value[i];
    current.__ob__ && current.__ob__.dep.depend();
    if (isArray(current)) {
      dependArray(current);
    }
  }
}

function defineReactive(data, key, value) {
  // value有可能是对象
  // 如果value是对象, 需要进行递归处理
  let childOb = observe(value);
  console.log('childOb', childOb);
  // 每个属性都对应一个dep
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      // 如果Dep.target有值, 说明属性在模板中被使用了
      if (Dep.target) {
        // dep记住watcher
        dep.depend();
        // 可能是数组, 可能是对象
        if (childOb) {
          // 数组和对象也记住watcher
          childOb.dep.depend();
          if (isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      // 设置了新对象, 需要重新进行劫持
      observe(newVal);
      value = newVal;
      dep.notify();
    },
  });
}

export function observe(data) {
  // console.log("observe", data);
  // 不是对象不处理
  if (!isObject(data)) {
    return;
  }
  // 已经响应式的对象不处理
  if (data.__ob__) {
    return data.__ob__;
  }
  return new Observer(data);
}

// 1. Vue中对象层次不能嵌套太深, 否则会有大量递归
// 2. Vue中对象是通过Object.definePrototype实现响应式的, 拦截了get和set, 如果不存在的属性不会拦截, 也不会响应
//    可以使用$set来让对象自己来实现notify, 或者赋予一个新对象
// 3. Vue中数组修改索引或者长度也不会进行视图更新, 通过修改原型的7个方法从而达成视图更新, 数组中如果是对象类型, 修改对象也可以更新视图
