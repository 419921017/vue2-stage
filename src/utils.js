/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:35:20
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 22:00:49
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
