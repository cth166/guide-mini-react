# Day2

- [x] 了解fiber架构的优点：

  1. 用来把挂载过程分成多个小块，一个渲染dom的动作对应一个fiber对象。
  2. 任务链条中间中断了，可以简单地从中断处继续执行。因为各个任务的关系已经构建好了链表关系。
  3. 在渲染真实的dom时，构建了当前fiber下所有children的关系。下一个任务指向第一个children，又在第一个children渲染成真实dom时，构建了此child下的children的关系。

- [x] 任务链的查找顺序是先child，后subling，后叔叔节点。但是如果当前节点很深，只找父节点的subling就不太够用了。直白的做法就是一直递归往上找父节点的subling。不知道有没有更好的方法。

  <div style="display:flex;height:300px">
      <img src='https://s2.loli.net/2024/01/14/SmjtWuLc5ROiwd3.png' />
      <img src='https://wechatapppro-1252524126.cdn.xiaoeknow.com/appewiejl9g3764/image/u_6482edb720c4d_DniGvx1NiY/lrdezlwz0g48.jpg?imageView2/2/w/1500/a/100|imageMogr2/ignore-error/1' />
  </div>

  

  ![img](https://wechatapppro-1252524126.cdn.xiaoeknow.com/appewiejl9g3764/image/u_6482edb720c4d_DniGvx1NiY/lrdf1u0405kt.png?imageView2/2/w/1500/a/100|imageMogr2/ignore-error/1)

今天状态：😅

经验 + 15
