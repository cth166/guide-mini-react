function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'string'
          ? createTextNode(child)
          : child
      )
    }
  }
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(el, container) {
  let dom
  if (el.type === 'TEXT_ELEMENT') {
    dom = document.createTextNode('')
  } else if (typeof el.type === 'string') {
    dom = document.createElement(el.type)
  } else if (typeof el.type === 'function') {
    const subTree = el.type(el.props)
    console.log(subTree)
    render(subTree, container)
    return
  }


  for (const [key, value] of Object.entries(el.props)) {
    if (key !== 'children') {
      dom[key] = value
    }
  }

  el.props.children.forEach(child => render(child, dom))

  container.appendChild(dom)
}

const React = {
  createElement,
  render
}

export default React