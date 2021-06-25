import { observe } from './observer';
import Watcher from './observer/watcher';
import { isArray, isFunction } from './utils';

/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:29:52
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-21 20:10:58
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

  // if (opts.computed) {
  // }

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
    proxy(vm, '_data', key);
  }
  observe(data);
}

function initWatch(vm, watch) {
  Object.keys((key) => {
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
