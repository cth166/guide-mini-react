# Day5

今天的难点主要是第四个视频，写的时候又碰到好多问题。 

1. 在优化的时候，使用闭包获取当前组件。在updateFunctionComponent时，通过全局变量wipFiber来保存当前的函数Fiber。后面在update函数里创建一个临时变量currentFiber来转存wipFiber，然后返回一个函数。为什么能拿到当前的组件Fiber呢？

    是因为调用函数Fiber.type()的时候，update里currentFiber保存的就是当前的函数fiber。闭包相当于一个快照。updater就知道用哪个函数fiber当成wipRoot，从而实现渲染单个组件，优化性能。感觉和vue里的getCurrentInstance类似。

   ```js
   function Bar() {
     console.log('Bar render')
     const updater = React.update()
     function handleClick() {
       countBar++
       updater()
     }
   
     return (
       <div>
         <h3>{countBar}</h3>
         <button onClick={handleClick}>+1</button>
       </div>
     )
   }
   ```

2. 最后找fiber结束点的时候。看看当前马上要执行的任务type和wipRoot.sibling.type是否一致。一致就停下了，因为兄弟组件不用更新。我一开始判断的是wipFiber.sibling.type，导致最后一个组件不渲染。

3. 难点主要是这节课概念有点多，而且改来改去，最后把currentRoot给改没了，优化成了wipRoot。引入了这个概念最后又优化了这个概念，确实不需要每次都从root开始，而是从当前组件的Fiber开始。

今天状态：😟难啊

经验 + 10

