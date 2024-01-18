# Day4

今天太坎坷了。大体流程了解了一遍，写的时候碰到好多问题。 

1. 找oldFiber的时候，用的fiber.parent.alternate.child。但实际fiber直接就是上一层节点，直接fiber.alternate.child就好了。 
2. 判断isSameType，一开始用的fiber.type ===   oldFiber.type。应该是child.type === oldFiber.type。
3. 如果isSameType为true，这时候生成的fiber.dom应该是alternate.dom。应该用老dom而不是null了。
4. 创建了两种effectTag不同的fiber，然后不知道在哪用这个类型。在commitWork处理每个小任务的时候tag是update就更新 props，是placement就dom.append。



今天状态：😡我是sbbbbb

经验 + 10

