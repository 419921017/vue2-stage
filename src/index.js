import { initMixin } from "./init";

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

export default Vue;
