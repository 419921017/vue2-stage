import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './render';
import { stateMixin } from './state';

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
stateMixin(Vue); // $watch

export default Vue;
