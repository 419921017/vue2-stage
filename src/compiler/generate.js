/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-22 21:30:18
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 20:12:11
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let styleObj = {};
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
        styleObj[arguments[1].trim()] = arguments[2].trim();
      });
      attr.value = styleObj;
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function genChildren(el) {
  let children = el.children;

  if (children) {
    return children.map((child) => gen(child)).join(',');
  }
  return false;
}

function gen(el) {
  if (el.type == 1) {
    return generate(el);
  } else {
    let text = el.text.trim();
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`;
    } else {
      let tokens = [];
      let match;
      // exec和正则中的g冲突, 每次操作的时候都要重置成0
      let lastIndex = (defaultTagRE.lastIndex = 0);
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join('+')})`;
    }
  }
}

export function generate(el) {
  let children = genChildren(el);

  let code = `_c('${el.tag}',${
    el.attrs && el.attrs.length > 0 ? genProps(el.attrs) : 'undefined'
  }${children ? `,${children}` : ''})`;

  return code;
}
