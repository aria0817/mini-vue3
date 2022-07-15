const nodeOps= {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null)
    },
  
    remove: child => {
      const parent = child.parentNode
      if (parent) {
        parent.removeChild(child)
      }
    },
  
    createElement: (tag, isSVG, is, props) => {
      const el = isSVG
        ? document.createElementNS(svgNS, tag)
        : document.createElement(tag, is ? { is } : undefined)
  
      if (tag === 'select' && props && props.multiple != null) {
        ;el.setAttribute('multiple', props.multiple)
      }
  
      return el
    },
  
    createText: text => document.createTextNode(text),
  
    createComment: text => document.createComment(text),
  
    setText: (node, text) => {
      node.nodeValue = text
    },
  
    setElementText: (el, text) => {
      el.textContent = text
    },
  
    parentNode: node => node.parentNode,
  
    nextSibling: node => node.nextSibling,
  
    querySelector: selector => document.querySelector(selector),
  
    setScopeId(el, id) {
      el.setAttribute(id, '')
    },
  
    cloneNode(el) {
      const cloned = el.cloneNode(true)
      // #3072
      // - in `patchDOMProp`, we store the actual value in the `el._value` property.
      // - normally, elements using `:value` bindings will not be hoisted, but if
      //   the bound value is a constant, e.g. `:value="true"` - they do get
      //   hoisted.
      // - in production, hoisted nodes are cloned when subsequent inserts, but
      //   cloneNode() does not copy the custom property we attached.
      // - This may need to account for other custom DOM properties we attach to
      //   elements in addition to `_value` in the future.
      if (`_value` in el) {
        ;cloned._value = el._value
      }
      return cloned
    },
  
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, isSVG, start, end) {
      // <parent> before | first ... last | anchor </parent>
      const before = anchor ? anchor.previousSibling : parent.lastChild
      // #5308 can only take cached path if:
      // - has a single root node
      // - nextSibling info is still available
      if (start && (start === end || start.nextSibling)) {
        // cached
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor)
          if (start === end || !(start = start.nextSibling)) break
        }
      } else {
        // fresh insert
        templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content
        const template = templateContainer.content
        if (isSVG) {
          // remove outer svg wrapper
          const wrapper = template.firstChild
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild)
          }
          template.removeChild(wrapper)
        }
        parent.insertBefore(template, anchor)
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ]
    }
}
  