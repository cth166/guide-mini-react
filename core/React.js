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

// work in progress -> wip
let wipRoot = null
let wipFiber = null //用来部分更新fiber树，来存函数fiber的快照
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextUnitOfWork = wipRoot
}

function update() {
  const currentFiber = wipFiber

  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot
  }
}

function createDom(fiber) {
  return fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type)
}

function updateProps(dom, newProps, oldProps) {
  // old有 new没有 删除
  Object.keys(oldProps).forEach(key => {
    if (key !== 'children') {
      if (!Object.hasOwn(newProps, key)) {
        dom.removeAttribute(key)
      }
    }
  })

  // 更新、添加
  Object.keys(newProps).forEach(key => {
    if (key !== 'children') {
      if (newProps[key] !== oldProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase()
          dom.removeEventListener(eventType, oldProps[key])
          dom.addEventListener(eventType, newProps[key])
        } else {
          dom[key] = newProps[key]
        }
      }
    }
  })
}


const deletions = []
function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevFiber = null
  let hasChild = false
  children.forEach((child) => {
    const isSameType = oldFiber && child.type === oldFiber.type
    let newFiber
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update'
      }
    } else {
      oldFiber && deletions.push(oldFiber)
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement'
        }
      }
    }

    if (newFiber) {
      oldFiber = oldFiber?.sibling

      if (!hasChild) {
        fiber.child = newFiber
        hasChild = true
      } else {
        prevFiber.sibling = newFiber
      }

      prevFiber = newFiber
    }
  })

  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber?.sibling
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = []
  stateHookIndex = 0
  effectHooks = []
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber)
    updateProps(dom, fiber.props, {})
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
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
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function commitDeletions(fiber) {
  let currentFiber = fiber

  while (!currentFiber.dom) {
    currentFiber = currentFiber.child
  }

  currentFiber.dom.remove()
}

function commitEffect() {

  runCleanup(wipRoot)
  run(wipRoot)

  function runCleanup(fiber) {
    if (!fiber) return

    const oldHooks = fiber.alternate?.effectHooks
    oldHooks?.forEach(hook => {
      hook.cleanUp?.()
    })

    runCleanup(fiber.child)
    runCleanup(fiber.sibling)
  }

  function run(fiber) {
    if (!fiber) return
    const isInit = !fiber.alternate
    const newHooks = fiber.effectHooks
    if (isInit) {
      newHooks?.forEach(hook => {
        (typeof cleanUp === 'function' && hook.deps.length > 0 || !hook.deps)
          && (hook.cleanUp = hook.callback())
      })
    } else {
      const oldHooks = fiber.alternate.effectHooks
      newHooks?.forEach((hook, index) => {
        const oldHook = oldHooks[index]
        const shouldCall = hook.deps.some((dep, i) => dep !== oldHook.deps[i])
        if (shouldCall || !hook.deps) {
          hook.cleanUp = hook.callback()
        }
      })

    }
    run(fiber.child)
    run(fiber.sibling)
  }
}

function commitRoot() {
  deletions.forEach(commitDeletions)
  commitWork(wipRoot.child)
  commitEffect()
  wipRoot = null
  deletions.length = 0
}

function commitWork(fiber) {
  if (!fiber) return
  let parentFiber = fiber.parent
  while (!parentFiber.dom) {
    parentFiber = parentFiber.parent
  }

  if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      parentFiber.dom.append(fiber.dom)
    }
  } else if (fiber.effectTag === 'update') {
    if (typeof fiber.type !== 'function') {
      updateProps(fiber.dom, fiber.props, fiber.alternate.props)
    } else {
      updateProps(fiber.child.dom, fiber.props, fiber.alternate.props)
    }
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYeild = false
  while (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = null
    }

    shouldYeild = deadline.timeRemaining() < 10
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

let stateHooks
let stateHookIndex
function useState(initialValue) {
  const currentFiber = wipFiber
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
  const stateHook = {
    state: oldHook?.state ?? initialValue,
    queue: oldHook?.queue ?? []
  }

  // 批量运行收集的actions
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })
  stateHook.queue = []

  stateHooks.push(stateHook)
  stateHookIndex++
  currentFiber.stateHooks = stateHooks

  function setHandler(action) {
    const actionFn = typeof action === 'function' ? action : () => action
    if (stateHook.state === actionFn(stateHook.state)) return
    stateHook.queue.push(actionFn)
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot
  }


  return [stateHook.state, setHandler]
}


let effectHooks
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanUp: null
  }
  effectHooks.push(effectHook)
  wipFiber.effectHooks = effectHooks
}

const React = {
  createElement,
  render,
  update,
  useState,
  useEffect
}

export default React