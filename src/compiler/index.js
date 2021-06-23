/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-21 20:40:53
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-22 21:36:04
 */

import { generate } from "./generate";
import { parserHTML } from "./parser";

export function compileToFunction(tempalte) {
  const ast = parserHTML(tempalte);

  let code = generate(ast);
  console.log("code", code);
  // html => ast(只能描述语法) => render函数 => vdom(增加额外属性) => 生成真实DOM
}
