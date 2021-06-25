/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-22 21:17:10
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-22 21:18:21
 */

// 标签名
const ncname = `[a-zA-Z_][\\w\\-\\.]*`;
// 获取标签名, match[1]
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 属性
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 标签关闭
const startTagClose = /^\s*(\/?)>/;
// {{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parserHTML(html) {
  let stack = [];
  let root = null;
  function createASTElement(tag, attrs, parent) {
    return {
      tag,
      type: 1,
      children: [],
      parent,
      attrs,
    };
  }
  function start(tag, attrs) {
    let parent = stack[stack.length - 1];
    let element = createASTElement(tag, attrs, parent);
    if (root == null) {
      root = element;
    }
    if (parent) {
      // 元素指向父节点
      element.parent = parent;
      // 父节点的children属性添加元素
      parent.children.push(element);
    }
    stack.push(element);
  }

  function end(tag) {
    let endTag = stack.pop();
    if (endTag.tag != tag) {
      console.log('标签出错');
    }
  }

  function text(chars) {
    let parent = stack[stack.length - 1];
    chars.replace(/\s/, '');
    if (chars) {
      parent.children.push({
        type: 2,
        text: chars,
      });
    }
  }

  function advance(len) {
    html = html.substring(len);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);
      let end;
      let attr;
      // 不能是开始的结束标签
      // 必须是属性
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }

      return match;
    } else {
      return false;
    }
  }

  while (html) {
    let index = html.indexOf('<');

    if (index === 0) {
      // 解析开始标签
      const startTagMatch = parseStartTag();

      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      let endTagMatch;
      if ((endTagMatch = html.match(endTag))) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }

      break;
    }
    // 文本
    if (index > 0) {
      let chars = html.substring(0, index);
      if (chars) {
        text(chars);
        advance(chars.length);
      }
    }
  }
  return root;
}
