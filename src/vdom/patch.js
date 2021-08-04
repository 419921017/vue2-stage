/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-24 19:46:04
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-24 20:22:35
 */
export function patch(oldVnode, vnode) {
  // 没有el元素, 说明是组件
  if (!oldVnode) {
    // 直接将虚拟节点转换成真实节点
    return createEle(vnode);
  }

  if (oldVnode.nodeType == 1) {
    // console.log("真实节点");
    const parentElm = oldVnode.parentNode;

    let elm = createEle(vnode);
    parentElm.insertBefore(elm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
    return elm;
  }
}

/**
 * 创建真实节点
 *
 * @export
 * @param {*} vnode
 * @return {*}
 */
export function createEle(vnode) {
  let { tag, data, children, text, vm } = vnode;
  if (typeof tag === 'string') {
    // 如果是组件
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el;
    }
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
    if (key == 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}

function createComponent(vnode) {
  let i = vnode.data;
  // 判断加赋值
  if ((i = i.hook) && (i = i.init)) {
    // 调用init方法
    i(vnode);
  }
  // 说明子组件已经new完毕了, 并且组件对应的真实DOM已经挂载到了componentInstance.$el上
  if (vnode.componentInstance) {
    return true;
  }
}
