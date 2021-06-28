import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
import { stateMixin } from "./state";

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

export default Vue;
