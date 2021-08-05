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

  // 元素节点
  if (oldVnode.nodeType == 1) {
    // console.log("真实节点");
    const parentElm = oldVnode.parentNode;

    let elm = createEle(vnode);
    parentElm.insertBefore(elm, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
    return elm;
  } else {
    // 标签名不一致, 直接替换
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
    }

    // 标签一样, 新节点el复用老节点的el
    let el = (vnode.el = oldVnode.el);

    // 如果两个虚拟节点是文本节点, 需要比较本文内容
    // 新的标签和老的标签都是undefined, 两者都是文本
    if (vnode.tag == undefined) {
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
      return;
    }
    // 如果标签一样, 比较属性
    patchProps(vnode, oldVnode.data);

    let newChildren = vnode.children || [];
    let oldChildren = oldVnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      patchChildren(el, oldChildren, newChildren);
    } else if (newChildren.length > 0) {
      for (const single of newChildren) {
        let child = createEle(single);
        el.appendChild(child);
      }
    } else if (oldChildren.length > 0) {
      el.innerHTML = ``;
    }
  }
}

function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
}

// dom的生成: ast => render方法 => 虚拟节点 => 真实dom
// NOTE: 更新时需要重新创建ast语法树吗?
// 如果通过dom动态的增加了节点(绕过vue添加的, vue监控不到的), 难道不需要重新ast么?
// 在vue中, 后续数据变了, 只会操作与vue相关的dom元素(vue管理的)
// 直接操作dom和vue无关, 不需要重新创建ast语法树

/**
 * vue的diff算法使用的是双指针
 *
 * @param {*} el
 * @param {*} oldChildren
 * @param {*} newChildren
 */
function patchChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldChildren.length - 1];

  let newStartIndex = 0;
  let oldStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newChildren.length - 1];

  const makeIndexByKey = (children) => {
    return children.reduce((memo, current, index) => {
      if (current.key) memo[current.key] = index;
      return memo;
    }, {});
  };

  const keysMap = makeIndexByKey(oldChildren);

  // 同时循环老的和新的节点, 有一方循环完了就直接结束
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头头比较, 向后添加
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾比较, 向前添加
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 头尾比较, 头部移动到尾部
      patch(oldStartVnode, newEndVnode);
      // 将老的元素放到新的元素的最后一个的下一个的节点前面
      el.insertBefore(oldStartVnode.el, newEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 尾头比较, 尾部移动到头部
      patch(oldEndVnode, newStartVnode);
      // 将老的元素放到新的元素的最后一个的下一个的节点前面
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      oldStartVnode = newChildren[++newStartIndex];
    } else {
      // 乱序比对, 核心diff
      // 1. 需要根据key和索引将老的内容生成映射表
      // 用新的节点的key到索引里查找
      let moveIndex = keysMap[newStartVnode.key];
      if (moveIndex == undefined) {
        el.insertBefore(createEle(newStartVnode), oldStartVnode.el);
      } else {
        let moveNode = oldChildren[moveIndex];
        // 避免数组塌陷, 用null填充占位
        oldChildren[moveIndex] = null;
        el.insertBefore(moveNode.el, oldStartVnode.el);
        // 移动节点和新节点进行patch
        patch(moveNode, newStartVnode);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }
  // 新的节点数量比老的节点数量多, 直接插入进去(经过上面的过程, 当前newStartIndex等于oldEndIndex)
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 尾指针的下一个有元素说明是往前加
      // 尾指针的下一个没元素说明是往后加
      // 通过insertBefore增加节点
      let anchor =
        newChildren[newEndIndex + 1] == null
          ? null
          : newChildren[newEndIndex + 1].el;
      // 第二个参数如果为null, 就是往后追加
      // 第二个参数不为null, 就是往前追加
      el.insertBefore(createEle(newChildren[i]), anchor);
    }
  }
  // 新元素少, 老元素多, 多出的元素需要删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      // 可能会有null的情况, 要排除null
      if (oldChildren[i] !== null) {
        el.removeChild(oldChildren[i].el);
      }
    }
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
    patchProps(vnode);
    // updateProperties(vnode);
    children.forEach((child) => {
      vnode.el.appendChild(createEle(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

/**
 * 初次渲染挂载属性
 * 再次渲染, 更新属性
 * @param {*} vnode
 * @param {*} newProps
 */
function patchProps(vnode, oldProps = {}) {
  let newProps = vnode.data || {};
  let el = vnode.el;

  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};

  // 老的有, 新的没有, 需要删除
  for (const key in oldStyle) {
    if (Object.hasOwnProperty.call(oldStyle, key)) {
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    }
  }

  for (const key in oldProps) {
    if (Object.hasOwnProperty.call(oldProps, key)) {
      if (!newProps[key]) {
        el.removeAttribute(key);
      }
    }
  }
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
