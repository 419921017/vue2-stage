/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 20:35:31
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-25 19:22:48
 */

let id = 0;
// 每个属性都分配一个dep, dep可以存放watcher, 一个dep对应多个watcher, 一个watcher对应多个dep
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}

Dep.target = null;

// 使用栈的方式存放多个watcher
let stack = [];

export function pushTarget(watcher) {
  stack.push(watcher);
  Dep.target = watcher;
}
export function popTarget(watcher) {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}

export default Dep;
