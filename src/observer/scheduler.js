/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 21:33:35
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 21:39:22
 */

import { nextTick } from '../utils';

let queue = [];
let has = {};

let pending = false;
export function queueWatcher(watcher) {
  const id = watcher;
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      nextTick(flushSchedulerQueue, 0);
      pending = true;
    }
  }
}

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  has = {};
  pending = false;
}
