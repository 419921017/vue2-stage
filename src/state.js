import { observe } from "./observer";
import Dep from "./observer/dep";
import Watcher from "./observer/watcher";
import { isArray, isFunction } from "./utils";

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:29:52
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-25 19:25:56
 */
export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    options.user = true;
    let watcher = new Watcher(this, key, handler, options);
    if (options.immediate) {
      handler(watcher.value);
    }
  };
}

export function initState(vm) {
  const opts = vm.$options;
  // if (opts.props) {
  // }

  // if (opts.methods) {
  // }

  if (opts.data) {
    initData(vm);
  }

  if (opts.computed) {
    initComputed(vm, opts.computed);
  }

  if (opts.watch) {
    initWatch(vm, opts.watch);
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  for (const key in data) {
    proxy(vm, "_data", key);
  }
  observe(data);
}

function initWatch(vm, watch) {
  Object.keys(watch).forEach((key) => {
    const handler = watch[key];
    if (isArray(handler)) {
      for (const fn of handler) {
        createWatcher(vm, key, fn);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  });
}

function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler);
}

function initComputed(vm, computed) {
  // 包含实例上所有的watcher属性
  const watchers = (vm._computedWatchers = {});
  Object.keys(computed).forEach((key) => {
    const userDef = computed[key];
    let getter = isFunction(userDef) ? userDef : userDef.get;
    console.log("getter", getter);
    // 每个计算属性, 本质上是一个watcher
    watchers[key] = new Watcher(vm, getter, () => {}, {
      lazy: true,
    });
    defineComputed(vm, key, userDef);
  });
}

function defineComputed(vm, key, userDef) {
  let sharedProperty = {};
  if (isFunction(userDef)) {
    sharedProperty.get = userDef;
  } else {
    sharedProperty.get = createComputedGetter(key);
    sharedProperty.set = userDef.set;
  }
  // computed本质上就是是个 Object.defineProperty
  Object.defineProperty(vm, key, sharedProperty);
}

function createComputedGetter(key) {
  // 取计算属性的值
  return function computedGetter() {
    // 这个watcher中包含了getter
    let watcher = this._computedWatchers[key];
    // 根据dirty属性来判断是否需要重新求值
    // 脏就是意味着需要调用用户的getter
    // 不脏就不用调用用户的getter
    if (watcher.dirty) {
      watcher.evaluate();
    }
    // 如果渲染watcher存在, 计算属性也需要收集渲染watcher
    if (Dep.target) {
      // watcher属性对应多个dep
      // 计算属性watcher对应内部有多个dep(computed所依赖的属性)
      watcher.depend();
    }
    return watcher.value;
  };
}
