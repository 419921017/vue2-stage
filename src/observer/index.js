import { isObject } from "../utils";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:38:12
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-17 21:55:14
 */

class Observer {
  constructor(data) {
    this.walk(data);
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
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      // 设置了新对象, 需要重新进行劫持
      observe(newVal);
      value = newVal;
    },
  });
}

export function observe(data) {
  console.log("observe", data);
  if (!isObject(data)) {
    return;
  }
  return new Observer(data);
}
