import { observe } from './observer';
import Dep from './observer/dep';
import Watcher from './observer/watcher';
import { isArray, isFunction } from './utils';

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
    // user标识
    options.user = true;
    let watcher = new Watcher(this, key, handler, options);
    // 立即执行
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

/**
 * 代理
 *
 * @param {*} vm 实例this
 * @param {*} source 目标source
 * @param {*} key key值
 * @return {*}
 */
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

/**
 * 初始化data, 如果是函数就执行并绑定this到实例上, 进行响应式监听
 *
 * @param {*} vm
 */
function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  // 通过_data进行代理
  for (const key in data) {
    proxy(vm, '_data', key);
  }
  // 对数据进行响应式监听
  observe(data);
}

/**
 * 初始化watch
 *
 * @param {*} vm
 * @param {*} watch
 */
function initWatch(vm, watch) {
  Object.keys(watch).forEach((key) => {
    const handler = watch[key];
    // handler是否是数组
    if (isArray(handler)) {
      for (const fn of handler) {
        createWatcher(vm, key, fn);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  });
}

/**
 * 创建watcher
 *
 * @param {*} vm
 * @param {*} key
 * @param {*} handler
 * @return {*}
 */
function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler);
}

/**
 * 初始化computed
 *
 * @param {*} vm
 * @param {*} computed
 */
function initComputed(vm, computed) {
  // 包含实例上所有的watcher属性
  const watchers = (vm._computedWatchers = {});
  Object.keys(computed).forEach((key) => {
    // computed可能是函数也有可能是对象
    const userDef = computed[key];
    let getter = isFunction(userDef) ? userDef : userDef.get;
    // console.log('getter', getter);
    // NOTE: 每个计算属性, 本质上是一个watcher
    watchers[key] = new Watcher(vm, getter, () => {}, {
      lazy: true,
    });
    defineComputed(vm, key, userDef);
  });
}

/**
 * 定义computed
 *
 * @param {*} vm
 * @param {*} key
 * @param {*} userDef
 */
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
