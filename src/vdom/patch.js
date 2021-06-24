/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 19:46:04
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 20:22:35
 */
export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType == 1) {
    console.log("真实节点");
    const parentElm = oldVnode.parentNode;

    let elm = createEle(vnode);
    parentElm.insertBefore(elm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
    return elm;
  }
}

export function createEle(vnode) {
  let { tag, data, children, text, vm } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach((child) => {
      vnode.el.appendChild(createEle(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;
  for (let key in newProps) {
    if (key == "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
