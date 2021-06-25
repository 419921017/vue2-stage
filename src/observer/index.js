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
class Observer {
  constructor(data) {
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

function defineReactive(data, key, value) {
  // value有可能是对象
  // 如果value是对象, 需要进行递归处理
  observe(value);
  // 每个属性都对应一个dep
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      // 如果Dep.target有值, 说明属性在模板中被使用了
      if (Dep.target) {
        //
        dep.depend();
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
    return;
  }
  return new Observer(data);
}
