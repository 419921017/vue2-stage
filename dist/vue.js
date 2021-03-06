(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:35:20
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-28 22:12:17
   */
  var isFunction = function isFunction(fn) {
    return typeof fn === 'function';
  };
  var isString = function isString(str) {
    return typeof str === 'string';
  };
  var isObject = function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  };
  var isArray = function isArray(arr) {
    return Array.isArray(arr);
  };
  var callbacks = [];
  var pending$1 = false;

  var flushCallbacks = function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    pending$1 = false;
  };
  /**
   * 调度系统的优雅降级
   *
   * @param {*} flushCallbacks
   */


  function timer(flushCallbacks) {
    var timerFn = function timerFn() {};

    if (Promise) {
      timerFn = function timerFn() {
        Promise.resolve().then(flushCallbacks);
      };
    } else if (MutationObserver) {
      var textNode = document.createTextNode('1');
      var observe = new MutationObserver(flushCallbacks);
      observe.observe(textNode, {
        characterData: true
      });

      timerFn = function timerFn() {
        textNode.textContent = '3';
      };
    } else if (setImmediate) {
      timerFn = function timerFn() {
        setImmediate(flushCallbacks);
      };
    } else {
      timerFn = function timerFn() {
        setTimeout(flushCallbacks);
      };
    }

    timerFn();
  }

  function nextTick(cb) {
    callbacks.push(cb);

    if (!pending$1) {
      timer(flushCallbacks);
      pending$1 = true;
    }
  }
  var lifeCycleHooks = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destoryed'];
  var structs = {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  lifeCycleHooks.forEach(function (hook) {
    structs[hook] = mergeHook;
  });

  structs.components = function (parentVal, childVal) {
    // 创建了一个对象 Object._proto_
    var options = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        if (Object.hasOwnProperty.call(childVal, key)) {
          // 先查找自身, 如果没有通过原型链查找
          options[key] = childVal[key];
        }
      }
    }

    return options;
  };

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeFieId(key);
    }

    for (var _key in child) {
      if (_key in parent) {
        continue;
      }

      mergeFieId(_key);
    }

    function mergeFieId(key) {
      var parentVal = parent[key];
      var childVal = child[key];

      if (structs[key]) {
        options[key] = structs[key](parentVal, childVal);
      } else if (isObject(parentVal) && isObject(childVal)) {
        options[key] = _objectSpread2(_objectSpread2({}, parentVal), childVal);
      } else {
        options[key] = childVal || parentVal;
      }
    }

    return options;
  }
  function isReservedTag(tagName) {
    var reservedTag = 'a, div, span, p, img, button, ul, li';
    return reservedTag.includes(tagName);
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-28 21:05:53
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-28 22:13:31
   */

  function initGlobalApi(Vue) {
    // 用来存储全局配置
    // 每个组件初始化的时候都会和options选项进行合并
    Vue.options = {};

    Vue.mixin = function (options) {
      this.options = mergeOptions(this.options, options);
    }; // 后续无论创建多少个子类, 都可以通过_base找到Vue


    Vue.options._base = Vue;
    Vue.options.components = {};

    Vue.component = function (id, definition) {
      // 保证组件的隔离, 每个组件都要创建一个新类, 继承父类
      definition = this.options._base.extend(definition);
      this.options.components[id] = definition;
    }; // 产生一个继承Vue的类


    Vue.extend = function (opts) {
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub; // 只和Vue的options合并

      Sub.options = mergeOptions(Super.options, opts);
      return Sub;
    };
  }

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
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
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
      }).join(',');
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

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs && el.attrs.length > 0 ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
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
      var endTag = stack.pop();

      if (endTag.tag != tag) {
        console.log('标签出错');
      }
    }

    function text(chars) {
      var parent = stack[stack.length - 1];
      chars.replace(/\s/, '');

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
        advance(start[0].length);

        var _end;

        var attr; // 不能是开始的结束标签
        // 必须是属性

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      } else {
        return false;
      }
    }

    while (html) {
      var index = html.indexOf('<');

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
    var code = generate(ast); // html => ast(只能描述语法) => render函数 => vdom(增加额外属性) => 生成真实DOM
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
    // 没有el元素, 说明是组件
    if (!oldVnode) {
      // 直接将虚拟节点转换成真实节点
      return createEle(vnode);
    } // 元素节点


    if (oldVnode.nodeType == 1) {
      // console.log("真实节点");
      var parentElm = oldVnode.parentNode;
      var elm = createEle(vnode);
      parentElm.insertBefore(elm, oldVnode.nextSibling);
      parentElm.removeChild(oldVnode);
      return elm;
    } else {
      // 标签名不一致, 直接替换
      if (oldVnode.tag !== vnode.tag) {
        return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
      } // 如果两个虚拟节点是文本节点, 需要比较本文内容
      // 新的标签和老的标签都是undefined, 两者都是文本


      if (vnode.tag == undefined) {
        if (oldVnode.text !== vnode.text) {
          el.textContent = vnode.text;
        }
      } // 标签一样, 新节点el复用老节点的el


      vnode.el = oldVnode.el; // 如果标签一样, 比较属性

      patchProps(vnode, oldVnode.data);
      var newChildren = vnode.children || [];
      var oldChildren = oldVnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        patchChildren(el, oldChildren, newChildren);
      } else if (newChildren.length > 0) {
        var _iterator = _createForOfIteratorHelper(newChildren),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var single = _step.value;
            var child = createEle(single);
            el.appendChild(child);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else if (oldChildren.length > 0) {
        el.innerHTML = "";
      }
    }
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
  }
  /**
   * vue的diff算法使用的是双指针
   *
   * @param {*} el
   * @param {*} oldChildren
   * @param {*} newChildren
   */


  function patchChildren(el, oldChildren, newChildren) {
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    oldChildren[oldChildren.length - 1];
    var newStartIndex = 0;
    var newStartNode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    newChildren[newChildren.length - 1]; // 同时循环老的和新的节点, 有一方循环完了就直接结束

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 头头比较
        patch(oldStartVnode, newStartNode);
      }
    }
  }
  /**
   * 创建真实节点
   *
   * @export
   * @param {*} vnode
   * @return {*}
   */


  function createEle(vnode) {
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text;
        vnode.vm;

    if (typeof tag === 'string') {
      // 如果是组件
      if (createComponent$1(vnode)) {
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      patchProps(vnode); // updateProperties(vnode);

      children.forEach(function (child) {
        vnode.el.appendChild(createEle(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  /**
   * 初次渲染挂载属性
   * 再次渲染, 更新属性
   * @param {*} vnode
   * @param {*} newProps
   */

  function patchProps(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el;
    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {}; // 老的有, 新的没有, 需要删除

    for (var key in oldStyle) {
      if (Object.hasOwnProperty.call(oldStyle, key)) {
        if (!newStyle[key]) {
          el.style[key] = '';
        }
      }
    }

    for (var _key in oldProps) {
      if (Object.hasOwnProperty.call(oldProps, _key)) {
        if (!newProps[_key]) {
          el.removeAttribute(_key);
        }
      }
    }

    for (var _key2 in newProps) {
      if (_key2 == 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function createComponent$1(vnode) {
    var i = vnode.data; // 判断加赋值

    if ((i = i.hook) && (i = i.init)) {
      // 调用init方法
      i(vnode);
    } // 说明子组件已经new完毕了, 并且组件对应的真实DOM已经挂载到了componentInstance.$el上


    if (vnode.componentInstance) {
      return true;
    }
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-24 20:35:31
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-25 19:22:48
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

  Dep.target = null; // 使用栈的方式存放多个watcher

  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget(watcher) {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-24 21:33:35
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-24 21:39:22
   */
  var queue = [];
  var has = {};
  var pending = false;
  function queueWatcher(watcher) {
    var id = watcher;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }

  function flushSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      queue[i].run();
    }

    queue = [];
    has = {};
    pending = false;
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-24 20:25:22
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-25 19:42:54
   */

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn; // 是不是用户watcher

      this.user = !!options.user; // 使用lazy区分是否是计算属性

      this.lazy = !!options.lazy;
      this.dirty = !!options.lazy;
      this.cb = cb;
      this.options = options;
      this.id = id++; // exprOrFn一调用就会取值

      if (isString(exprOrFn)) {
        // 如果表达式是字符串, 转换成函数
        this.getter = function () {
          // 当数据取值时, 会进行依赖收集
          var obj = vm; // 字符串有".", 说明是对象的多层

          return exprOrFn.split('.').reduce(function (a, b) {
            return a[b];
          }, obj); // for (const item of exprOrFn.split('.')) {
          //   obj = obj[item];
          // }
          // return obj;
        };
      } else {
        this.getter = exprOrFn;
      } // 对应的收集


      this.deps = []; // 对应的收集id

      this.depsId = new Set(); // 默认的初始化操作
      // lazy指的是computed

      this.value = this.lazy ? undefined : this.get();
    } // 数据更新时, 重新调用getter


    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 每个属性都可以收集自己的watcher, 一个属性对应多个watcher, 一个watcher对应多个属性
        // Dep.target = watcher
        pushTarget(this); // render()方法会去vm上取值, vm._update(vm._render())

        var value = this.getter.call(this.vm); // Dep.target = null, 如果Dep.target有值, 说明值在模板中使用了

        popTarget();
        return value;
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
        // this.get();
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get();
        var oldValue = this.value; // 替换旧值

        this.value = newValue; // console.log('this.cb', this.cb);

        this.user && this.cb.call(this.vm, newValue, oldValue);
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        // 取过值了
        this.dirty = false;
        this.value = this.get();
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }(); // 将更新功能封装成了一个watcher

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-23 21:18:30
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-28 22:08:56
   */
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };

    Vue.prototype.$nextTick = nextTick;
  }
  function mountComponent(vm, el) {
    // 更新函数, 数据变化后会再次调用
    var updateComponent = function updateComponent() {
      // 调用render函数, 生成虚拟dom
      vm._update(vm._render()); // 用虚拟dom生成真实dom

    };

    callHook(vm, 'beforeMount'); // updateComponent();
    // true表示这是一个渲染watcher
    // 每个组件都对一个渲染watcher

    new Watcher(vm, updateComponent, function () {
      console.log('update');
    }, true);
    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    vm.$options[hook] && vm.$options[hook].forEach(function (fn) {
      return fn.call(vm);
    });
  }

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
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
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
        case 'push':
        case 'unshfit':
          inserted = args; // 就是新增的内容

          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observeArray(inserted);
      } // 数组的observe.dep


      ob.dep.notify();
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
  // 给对象新增一个属性, 不会触发更新, 可以通过$set, 给对象本身增加一个dep, dep存watcher, 如果增加一个属性后, 手动触发watcher

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // 给对象和数组添加一个自定义属性
      // __ob__ 会造成死循环

      Object.defineProperty(data, '__ob__', {
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
  /**
   * 数组的子元素还是数组的情况
   *
   * @param {*} value
   */


  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    // value有可能是对象
    // 如果value是对象, 需要进行递归处理
    var childOb = observe(value); // 每个属性都对应一个dep

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        // 如果Dep.target有值, 说明属性在模板中被使用了
        if (Dep.target) {
          // dep记住watcher
          dep.depend(); // 可能是数组, 可能是对象

          if (childOb) {
            // 数组和对象也记住watcher
            childOb.dep.depend();

            if (isArray(value)) {
              dependArray(value);
            }
          }
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
    // console.log("observe", data);
    // 不是对象不处理
    if (!isObject(data)) {
      return;
    } // 已经响应式的对象不处理


    if (data.__ob__) {
      return data.__ob__;
    }

    return new Observer(data);
  } // 1. Vue中对象层次不能嵌套太深, 否则会有大量递归
  // 2. Vue中对象是通过Object.definePrototype实现响应式的, 拦截了get和set, 如果不存在的属性不会拦截, 也不会响应
  //    可以使用$set来让对象自己来实现notify, 或者赋予一个新对象
  // 3. Vue中数组修改索引或者长度也不会进行视图更新, 通过修改原型的7个方法从而达成视图更新, 数组中如果是对象类型, 修改对象也可以更新视图

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:29:52
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-25 19:25:56
   */

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, handler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // user标识
      options.user = true;
      var watcher = new Watcher(this, key, handler, options); // 立即执行

      if (options.immediate) {
        handler(watcher.value);
      }
    };
  }
  function initState(vm) {
    var opts = vm.$options; // if (opts.props) {
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
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }
  /**
   * 初始化data, 如果是函数就执行并绑定this到实例上, 进行响应式监听
   *
   * @param {*} vm
   */


  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data; // 通过_data进行代理

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对数据进行响应式监听


    observe(data);
  }
  /**
   * 初始化watch
   *
   * @param {*} vm
   * @param {*} watch
   */


  function initWatch(vm, watch) {
    Object.keys(watch).forEach(function (key) {
      var handler = watch[key]; // handler是否是数组

      if (isArray(handler)) {
        var _iterator = _createForOfIteratorHelper(handler),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var fn = _step.value;
            createWatcher(vm, key, fn);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
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
    var watchers = vm._computedWatchers = {};
    Object.keys(computed).forEach(function (key) {
      // computed可能是函数也有可能是对象
      var userDef = computed[key];
      var getter = isFunction(userDef) ? userDef : userDef.get; // console.log('getter', getter);
      // NOTE: 每个计算属性, 本质上是一个watcher

      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
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
    var sharedProperty = {};

    if (isFunction(userDef)) {
      sharedProperty.get = userDef;
    } else {
      sharedProperty.get = createComputedGetter(key);
      sharedProperty.set = userDef.set;
    } // computed本质上就是是个 Object.defineProperty


    Object.defineProperty(vm, key, sharedProperty);
  }

  function createComputedGetter(key) {
    // 取计算属性的值
    return function computedGetter() {
      // 这个watcher中包含了getter
      var watcher = this._computedWatchers[key]; // 根据dirty属性来判断是否需要重新求值
      // 脏就是意味着需要调用用户的getter
      // 不脏就不用调用用户的getter

      if (watcher.dirty) {
        watcher.evaluate();
      } // 如果渲染watcher存在, 计算属性也需要收集渲染watcher


      if (Dep.target) {
        // watcher属性对应多个dep
        // 计算属性watcher对应内部有多个dep(computed所依赖的属性)
        watcher.depend();
      }

      return watcher.value;
    };
  }

  /*
   * @Descripttion: your project
   * @version: 1.0
   * @Author: power_840
   * @Date: 2021-06-17 21:24:30
   * @LastEditors: power_840
   * @LastEditTime: 2021-06-28 22:12:29
   */
  /**
   *
   * 在Vue的基础上做一次混合操作
   * @export
   * @param {*} Vue
   */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // vm.constructor.options, 继承的时候不一定是根Vue可能是Vue.extends. 所以要找到构造函数, 找构造函数上的options

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');

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
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render;
      } // 组件的挂载流程


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
  /**
   *
   *
   * @export
   * @param {*} vm
   * @param {*} tag 标签名, 组件名
   * @param {*} [data={}]
   * @param {*} children
   * @return {*}
   */

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(vm, tag, data, data.key, children, undefined);
    } else {
      var Ctor = vm.$options.components[tag];
      return createComponent(vm, tag, data, data.key, children, Ctor);
    }
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  /**
   * 创建组件的组件的虚拟节点
   *
   * @export
   * @param {*} vm
   * @param {*} tag
   * @param {*} data
   * @param {*} key
   * @param {*} children
   * @param {*} Ctor
   *
   * 1. 给组件创建一个构造函数, 基于Vue
   * 2. 开始生成虚拟节点, 对组件进行特殊处理, data.hook = { init() {} }
   * 3. 生成dom节点, 如果当前虚拟节点有hook.init属性, 说明是组件
   * 4. 对自己进行new 组件().$mount() => vm.$el, 将组件对应的真实节点挂载到实例的$el上
   * 5. 将组件的$el插入到父容器中(父组件)
   */

  function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    } // 渲染组件时需要调用该初始化方法


    data.hook = {
      init: function init(vnode) {
        var vm = vnode.componentInstance = new Ctor({
          _isComponent: true
        }); // 组件挂载完成后, vm.$el => 真实节点, vm.$el对应的是组件的真实dom

        vm.$mount();
      }
    };
    return vnode(vm, "vue-component-".concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
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
      if (isObject(val)) {
        return JSON.stringify(val);
      }

      return val;
    };

    Vue.prototype._render = function () {
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
   * @LastEditTime: 2021-06-28 21:06:52
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue); // _render

  lifecycleMixin(Vue); // _update

  stateMixin(Vue); // $watch
  // 在类上扩展 Vue.mixin

  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
