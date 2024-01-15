function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode
          ? createTextNode(child)
          : child
      })
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

let root = null
function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el]
    }
  }
  root = nextUnitOfWork
}

function createDom(fiber) {
  return fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type)
}

function updateProps(dom, fiber) {
  for (const [key, value] of Object.entries(fiber.props)) {
    if (key !== 'children') {
      dom[key] = value
    }
  }
}

function initChildren(fiber, children) {
  let prevFiber = null
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
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber)
    updateProps(dom, fiber)
  }

  const children = fiber.props.children
  initChildren(fiber, children)
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.subling) return nextFiber.subling
    nextFiber = nextFiber.parent
  }
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) return
  let parentFiber = fiber.parent
  while (!parentFiber.dom) {
    parentFiber = parentFiber.parent
  }

  if (fiber.dom) {
    parentFiber.dom.append(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.subling)
}

let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYeild = false
  while (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYeild = deadline.timeRemaining() < 10
  }

  if (!nextUnitOfWork && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

const React = {
  createElement,
  render
}

export default React