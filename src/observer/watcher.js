import { isString } from "../utils";
import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 20:25:22
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-25 19:42:54
 */
let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    // 是不是用户watcher
    this.user = !!options.user;
    // 使用lazy区分是否是计算属性
    this.lazy = !!options.lazy;
    this.dirty = !!options.lazy;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    // exprOrFn一调用就会取值
    if (isString(exprOrFn)) {
      // 如果表达式是字符串, 转换成函数
      this.getter = function () {
        // 当数据取值时, 会进行依赖收集
        let obj = vm;
        return exprOrFn.split(".").reduce((a, b) => a[b], obj);
        // for (const item of exprOrFn.split('.')) {
        //   obj = obj[item];
        // }
        // return obj;
      };
    } else {
      this.getter = exprOrFn;
    }
    this.deps = [];
    this.depsId = new Set();
    // 默认的初始化操作
    this.value = this.lazy ? undefined : this.get();
  }
  // 数据更新时, 重新调用getter
  get() {
    // 每个属性都可以收集自己的watcher, 一个属性对应多个watcher, 一个watcher对应多个属性
    // Dep.target = watcher
    pushTarget(this);
    // render()方法会去vm上取值, vm._update(vm._render())
    const value = this.getter.call(this.vm);
    // Dep.target = null, 如果Dep.target有值, 说明值在模板中使用了
    popTarget();
    return value;
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
    // this.get();
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }
  run() {
    const newValue = this.get();
    let oldValue = this.value;
    // 替换旧值
    this.value = newValue;
    console.log("this.cb", this.cb);
    this.user && this.cb.call(this.vm, newValue, oldValue);
  }
  evaluate() {
    // 取过值了
    this.dirty = false;
    this.value = this.get();
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }
}

// 将更新功能封装成了一个watcher
// 渲染页面前, 会将当前watcher放到Dep类上
// 在vue找那个渲染页面使用的属性, 需要进行依赖收集, 收集对象的渲染watcher
// 取值时, 给每个属性都加了dep属性, 用于存储这个渲染watcher, 同一个watcher会对应多个dep
// 每给属性可能对应多个视图(多个watcher), 一个属性对应多个watcher
// dep.depend(), 通知dep存放watcher => Dep.target.addDep(), 通知watcher存放dep
// dep和watcher是双向取值的
export default Watcher;
