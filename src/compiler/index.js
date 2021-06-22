/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-21 20:40:53
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-22 21:18:02
 */

import { parserHTML } from "./parser";

export function compileToFunction(tempalte) {
  const ast = parserHTML(tempalte);
}
