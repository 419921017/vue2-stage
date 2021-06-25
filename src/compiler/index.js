/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-21 20:40:53
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-23 21:16:27
 */

import { generate } from './generate';
import { parserHTML } from './parser';

export function compileToFunction(tempalte) {
  const ast = parserHTML(tempalte);

  let code = generate(ast);
  // html => ast(只能描述语法) => render函数 => vdom(增加额外属性) => 生成真实DOM
  // new Function + width
  let render = new Function(`with(this) {return ${code}}`);
  return render;
}
