import { popTarget, pushTarget } from "./dep";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 20:25:22
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 21:19:45
 */
let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    // exprOrFn一调用就会取值
    this.getter = exprOrFn;
    this.deps = [];
    this.depsId = new Set();
    // 默认的初始化操作
    this.get();
  }
  // 数据更新时, 重新调用getter
  get() {
    // 每个属性都可以收集自己的watcher, 一个属性对应多个watcher, 一个watcher对应多个属性
    // Dep.target = watcher
    pushTarget(this);
    // render()方法会去vm上取值, vm._update(vm._render())
    this.getter();
    // Dep.target = null, 如果Dep.target有值, 说明值在模板中使用了
    popTarget();
  }
  addDep(dep) {
    let id = dep.id;
    // 实现去重
    if (!this.depsId.has(id)) {
      // watcher收集dep
      this.depsId.add(id);
      this.deps.push(dep);
      // dep收集watcher
      dep.addSub(this);
    }
  }
  update() {
    this.get();
  }
}

export default Watcher;
