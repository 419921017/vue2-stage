/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:35:20
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-28 22:12:17
 */
export const isFunction = (fn) => typeof fn === 'function';
export const isString = (str) => typeof str === 'string';
export const isNumber = (num) => typeof num === 'number';
export const isObject = (obj) => typeof obj === 'object' && obj !== null;
export const isArray = (arr) => Array.isArray(arr);

const callbacks = [];
let pending = false;

const flushCallbacks = () => {
  callbacks.forEach((cb) => cb());
  callbacks.length = 0;
  pending = false;
};

/**
 * 调度系统的优雅降级
 *
 * @param {*} flushCallbacks
 */
function timer(flushCallbacks) {
  let timerFn = () => {};

  if (Promise) {
    timerFn = () => {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    let textNode = document.createTextNode('1');
    let observe = new MutationObserver(flushCallbacks);
    observe.observe(textNode, {
      characterData: true,
    });
    timerFn = () => {
      textNode.textContent = '3';
    };
  } else if (setImmediate) {
    timerFn = () => {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFn = () => {
      setTimeout(flushCallbacks);
    };
  }
  timerFn();
}

export function nextTick(cb) {
  callbacks.push(cb);

  if (!pending) {
    timer(flushCallbacks);
    pending = true;
  }
}

let lifeCycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed',
];

let structs = {};

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

lifeCycleHooks.forEach((hook) => {
  structs[hook] = mergeHook;
});

structs.components = function (parentVal, childVal) {
  // 创建了一个对象 Object._proto_
  let options = Object.create(parentVal);
  if (childVal) {
    for (const key in childVal) {
      if (Object.hasOwnProperty.call(childVal, key)) {
        // 先查找自身, 如果没有通过原型链查找
        options[key] = childVal[key];
      }
    }
  }
  return options;
};

export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    mergeFieId(key);
  }
  for (let key in child) {
    if (key in parent) {
      continue;
    }
    mergeFieId(key);
  }
  function mergeFieId(key) {
    let parentVal = parent[key];
    let childVal = child[key];
    if (structs[key]) {
      options[key] = structs[key](parentVal, childVal);
    } else if (isObject(parentVal) && isObject(childVal)) {
      options[key] = { ...parentVal, ...childVal };
    } else {
      options[key] = childVal || parentVal;
    }
  }
  return options;
}

export function isReservedTag(tagName) {
  let reservedTag = 'a, div, span, p, img, button, ul, li';
  return reservedTag.includes(tagName);
}
