# Day3

- [x] React官网上也提到了[Render And  Commit](https://react.dev/learn/render-and-commit)这个概念。React中页面更新分为三步👇

  ![img](https://wechatapppro-1252524126.cdn.xiaoeknow.com/appewiejl9g3764/image/u_6482edb720c4d_DniGvx1NiY/lrex7bak0wik.png?imageView2/2/w/1500/a/100|imageMogr2/ignore-error/1)

  1. 触发一个render。
  1. React来渲染节点，就目前课程来看，这个步骤是把真实dom放到各个fiber对象上，并且把fiber任务的前后顺序通过链表的结构构建好。
  1. 最终commit给dom。就目前课程来看，挂载时只执行一次commit，把所有的dom都append好。基本就是把当前fiber.dom添加到fiber.parent.dom里。如果fiber.parent没有dom（函数组件的fiber就没有dom），就继续往上找fiber.parent.parent的dom。

- [x] 函数组件的思想主要是《开箱》。vue中挂载组件，是执行组件的render函数拿到subTree，subTree就成了一个Element类型的节点，然后继续patch的时候就递归下去了。React中，performWorkOfUnit里接收到函数组件的fiber时，fiber.type(fiber.props)也相当于执行了render函数。然后处理函数组件的fiber的children的时候，把render函数返回的vdom当成children，进而继续构建链表关系。


今天状态：😊

经验 + 10

