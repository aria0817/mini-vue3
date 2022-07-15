import { createRenderer } from "@vue/runtime-core";
const renderer = createRenderer({

  // 创建元素时要是用 type 就是 是元素类型，例如html时候的 div 之类的
  // 只是个 字符串 名字而已，这里面需要你通过这个类型 来自己创建一个元素，然后 return 回去
  // 这个函数后面还有2个参数 有兴趣的朋友 可以自行探索
  createElement(type) {
   // 例(html)
  	let element;
    switch (type) {
      case "div":
        element = document.createElement("div");
        break;
    }
    return element;
  },
  
  // 设置元素的文本 node 就是要设置文本的那个节点对象，text 就是要设置的文本，函数不需要返回值
  setElementText(node, text) {
    // 例(html)
    var textNode = document.createTextNode(text);
    node.appendChild(textNode);
  },
  
  // 文本文本对象的函数，需要返回一个 元素对象
  createText(text) {
    // 例(html)
    return document.createTextNode(text);
  },

  // 给 元素节点 添加设置属性的函数 
  // el 就是要设置的元素，key 是属性名，prevValue 是以前的值 nextValue 是当前要设置、的值
  // 这个函数后面还有几个参数 有兴趣的朋友 可以自行探索
  patchProp(el, key, prevValue, nextValue) {
  	// 例(html)
    el[key] = nextValue;
  },

  // 将元素插入父节点的元素，el 要插入的元素对象，parent 父元素对象
  insert(el, parent) {
    // 例(html)
    parent.appendChild(el);
  },
  
  /*---- 后面这几个函数有兴趣的朋友可以自行探索 ----*/
  // 处理注释
  createComment() {},
  // 获取父节点
  parentNode() {},
  // 获取兄弟节点
  nextSibling() {},
  // 删除节点时调用
  remove(el) {}
});

// 最后导出 createApp （没错 就是Vue3.0创建根对象那个createApp）
export function createApp(rootComponent) {
  return renderer.createApp(rootComponent);
}
