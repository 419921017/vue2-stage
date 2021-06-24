/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 20:35:31
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 21:20:18
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

export function pushTarget(watcher) {
  Dep.target = watcher;
}
export function popTarget(watcher) {
  Dep.target = null;
}

export default Dep;
