(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-22 21:30:18
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 20:12:11
   */
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = "";

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === "style") {
        (function () {
          var styleObj = {};
          attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
            styleObj[arguments[1].trim()] = arguments[2].trim();
          });
          attr.value = styleObj;
        })();
      }

      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(",");
    }

    return false;
  }

  function gen(el) {
    if (el.type == 1) {
      return generate(el);
    } else {
      var text = el.text.trim();

      if (!defaultTagRE.test(text)) {
        return "_v('".concat(text, "')");
      } else {
        var tokens = [];
        var match; // exec和正则中的g冲突, 每次操作的时候都要重置成0

        var lastIndex = defaultTagRE.lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          var index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join("+"), ")");
      }
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs && el.attrs.length > 0 ? genProps(el.attrs) : "undefined").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-22 21:17:10
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-22 21:18:21
   */
  // 标签名
  var ncname = "[a-zA-Z_][\\w\\-\\.]*"; // 获取标签名, match[1]

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 开始标签

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 结束标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 属性

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 标签关闭

  var startTagClose = /^\s*(\/?)>/; // {{}}
  function parserHTML(html) {
    var stack = [];
    var root = null;

    function createASTElement(tag, attrs, parent) {
      return {
        tag: tag,
        type: 1,
        children: [],
        parent: parent,
        attrs: attrs
      };
    }

    function start(tag, attrs) {
      // console.log("start", tag, attrs);
      var parent = stack[stack.length - 1];
      var element = createASTElement(tag, attrs, parent);

      if (root == null) {
        root = element;
      }

      if (parent) {
        // 元素指向父节点
        element.parent = parent; // 父节点的children属性添加元素

        parent.children.push(element);
      }

      stack.push(element);
    }

    function end(tag) {
      // console.log("end", tag);
      var endTag = stack.pop();

      if (endTag.tag != tag) {
        console.log("标签出错");
      }
    }

    function text(chars) {
      // console.log("text", chars);
      var parent = stack[stack.length - 1];
      chars.replace(/\s/, "");

      if (chars) {
        parent.children.push({
          type: 2,
          text: chars
        });
      }
    }

    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // console.log(match, html);

        var _end;

        var attr; // 不能是开始的结束标签
        // 必须是属性

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        } // console.log("end", end);


        if (_end) {
          advance(_end[0].length);
        }

        return match;
      } else {
        return false;
      }
    }

    while (html) {
      var index = html.indexOf("<");

      if (index === 0) {
        // 解析开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = void 0;

        if (endTagMatch = html.match(endTag)) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }

        break;
      } // 文本


      if (index > 0) {
        var chars = html.substring(0, index);

        if (chars) {
          text(chars);
          advance(chars.length);
        }
      }
    }

    console.log("root", root);
    return root;
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-21 20:40:53
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-23 21:16:27
   */
  function compileToFunction(tempalte) {
    var ast = parserHTML(tempalte);
    var code = generate(ast);
    console.log("code", code); // html => ast(只能描述语法) => render函数 => vdom(增加额外属性) => 生成真实DOM
    // new Function + width

    var render = new Function("with(this) {return ".concat(code, "}"));
    return render;
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-24 19:46:04
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 20:22:35
   */
  function patch(oldVnode, vnode) {
    if (oldVnode.nodeType == 1) {
      console.log("真实节点");
      var parentElm = oldVnode.parentNode;
      var elm = createEle(vnode);
      parentElm.insertBefore(elm, oldVnode.nextSibling);
      parentElm.removeChild(oldVnode);
      return elm;
    }
  }
  function createEle(vnode) {
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text;
        vnode.vm;

    if (typeof tag === "string") {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createEle(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var newProps = vnode.data || {};
    var el = vnode.el;

    for (var key in newProps) {
      if (key == "style") {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

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
   * @Date: 2021-06-24 20:35:31
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 21:20:18
   */
  var id$1 = 0; // 每个属性都分配一个dep, dep可以存放watcher, 一个dep对应多个watcher, 一个watcher对应多个dep

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  function pushTarget(watcher) {
    Dep.target = watcher;
  }
  function popTarget(watcher) {
    Dep.target = null;
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-24 20:25:22
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 21:19:45
   */

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.id = id++; // exprOrFn一调用就会取值

      this.getter = exprOrFn;
      this.deps = [];
      this.depsId = new Set(); // 默认的初始化操作

      this.get();
    } // 数据更新时, 重新调用getter


    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 每个属性都可以收集自己的watcher, 一个属性对应多个watcher, 一个watcher对应多个属性
        // Dep.target = watcher
        pushTarget(this); // render()方法会去vm上取值, vm._update(vm._render())

        this.getter(); // Dep.target = null, 如果Dep.target有值, 说明值在模板中使用了

        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id; // 实现去重

        if (!this.depsId.has(id)) {
          // watcher收集dep
          this.depsId.add(id);
          this.deps.push(dep); // dep收集watcher

          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-23 21:18:30
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 21:08:27
   */
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log("_update");
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // 更新函数, 数据变化后会再次调用
    var updateComponent = function updateComponent() {
      // 调用render函数, 生成虚拟dom
      vm._update(vm._render()); // 用虚拟dom生成真实dom

    }; // updateComponent();
    // true表示这是一个渲染watcher
    // 每个组件都对一个渲染watcher


    new Watcher(vm, updateComponent, function () {
      console.log("udpate");
    }, true);
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
   * @LastEditTime: 2021-06-24 21:10:10
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
    observe(value); // 每个属性都对应一个dep

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        // 如果Dep.target有值, 说明属性在模板中被使用了
        if (Dep.target) {
          //
          dep.depend();
        }

        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return; // 设置了新对象, 需要重新进行劫持

        observe(newVal);
        value = newVal;
        dep.notify();
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
   * @LastEditTime: 2021-06-24 19:44:19
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
      vm.$el = el;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          console.log("el", el);
          template = el.outerHTML;
          var render = compileToFunction(template);
          options.render = render;
        }
      }

      console.log(options.render); // 组件的挂载流程

      mountComponent(vm);
    };
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-23 21:31:22
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-23 21:35:54
   */
  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, data, data.key, children, undefined);
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-23 21:23:10
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 19:59:20
   */

  function renderMixin(Vue) {
    Vue.prototype._c = function (tag, data) {
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }

      // @ts-ignore
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextElement(this, text);
    };

    Vue.prototype._s = function (val) {
      if (_typeof(val) === "object") {
        return JSON.stringify(val);
      }

      return val;
    };

    Vue.prototype._render = function () {
      console.log("_render");
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:07:28
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-23 21:23:40
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue); // _render

  lifecycleMixin(Vue); // _update

  return Vue;

})));
//# sourceMappingURL=vue.js.map
