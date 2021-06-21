/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-21 20:40:53
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-21 22:13:06
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

function start(tagName, attributes) {}
function end(tagName) {}
function chars(text) {}

function parseHTML(html) {
  function advance(len) {
    html = html.substring(len);
    console.log("advance", html);
  }
  function parseStartTag(html) {
    console.log("parseStartTag", html);
    const start = html.match(startTagOpen);
    console.log("start", start);

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);
      let end;
      let attr;
      console.log(" advanced", html);

      // 如果没有遇到标签结尾, 会一直找下去, 不停解析
      console.log(html.match(startTagClose));
      console.log(html.match(attribute));
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        console.log("attr", attr);
        advance(attr[0].length);
      }
    }
    return false;
  }
  function parseEndTag() {
    return false;
  }

  // while (html) {
  let textEnd = html.indexOf("<");
  if (textEnd === 0) {
    const startTagMatch = parseStartTag(html);
    if (startTagMatch) {
    }

    const endTagMatch = parseEndTag();
    if (endTagMatch) {
    }
  }
  // }
}

export function compileToFunction(tempalte) {
  parseHTML(tempalte);
}
