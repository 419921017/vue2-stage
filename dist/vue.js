(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-21 20:40:53
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-21 20:41:07
   */
  function compileToFunction(tempalte) {}

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:35:20
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-21 20:45:23
   */
  var isFunction = function isFunction(fn) {
    return typeof fn === "function";
  };
  var isObject = function isObject(obj) {
    return _typeof(obj) === "object" && obj !== null;
  };
  var isArray = function isArray(arr) {
    return Array.isArray(arr);
  };

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-21 20:23:55
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-21 20:50:04
   */
  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype);
  var methods = ["push", "pop", "shift", "unshift", "splice", "reverse", "sort"];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case "push":
        case "unshfit":
          inserted = args; // 就是新增的内容

          break;

        case "splice":
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observeArray(inserted);
      }
    };
  });

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:38:12
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-21 21:21:41
   */

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 给对象和数组添加一个自定义属性
      // __ob__ 会造成死循环
      Object.defineProperty(data, "__ob__", {
        value: this,
        // 这属性不能被枚举, 无法被循环到
        enumerable: false
      }); // data.__ob__ = this;

      if (isArray(data)) {
        // 重写数组方法
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    } // 递归遍历数组, 对数组内部的对象再次进行重写[[]] [{}]


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        // 数组里面如果是引用类型, 继续进行observe, 响应式
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // value有可能是对象
    // 如果value是对象, 需要进行递归处理
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return; // 设置了新对象, 需要重新进行劫持

        observe(newVal);
        value = newVal;
      }
    });
  }

  function observe(data) {
    console.log("observe", data);

    if (!isObject(data)) {
      return;
    }

    if (data.__ob__) {
      return;
    }

    return new Observer(data);
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:29:52
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-21 20:10:58
   */

  function initState(vm) {
    console.log("initState", vm.$options);
    var opts = vm.$options; // if (opts.props) {
    // }
    // if (opts.methods) {
    // }

    if (opts.data) {
      initData(vm);
    } // if (opts.computed) {
    // }
    // if (opts.watch) {
    // }

  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, "_data", key);
    } // console.log("initData", data);


    observe(data);
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:24:30
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-21 20:42:40
   */
  /**
   *
   * 在Vue的基础上做一次混合操作
   * @export
   * @param {*} Vue
   */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // console.log("options", options);
      var vm = this;
      vm.$options = options;
      initState(vm);

      if (vm.$options.el) {
        // 将数据挂在模板上
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outterHTML;
          var render = compileToFunction();
          options.render = render;
        }
      }
    };
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:07:28
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-17 21:25:51
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
