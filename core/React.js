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
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el]
    }
  }
}

function createDom(fiber) {
  return fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type)
}

function handleProps(dom, fiber) {
  for (const [key, value] of Object.entries(fiber.props)) {
    if (key !== 'children') {
      dom[key] = value
    }
  }
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber)
    fiber.parent.dom.append(dom)
    handleProps(dom, fiber)
  }

  let prevFiber = null
  const children = fiber.props.children
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      subling: null,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevFiber.subling = newFiber
    }
    prevFiber = newFiber
  })

  function traverseParent(fiber) {
    if (!fiber) return null

    return fiber.parent?.subling || traverseParent(fiber.parent)
  }

  // 返回下一个fiber的优先级。先child，后subing，后叔叔
  return fiber.child || fiber.subling || fiber.parent.subling || traverseParent(fiber.parent)
}

let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYeild = false
  while (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYeild = deadline.timeRemaining() < 10
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

const React = {
  createElement,
  render
}

export default React