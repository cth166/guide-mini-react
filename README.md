# Day6

今天的注意点是清空各种数组，队列的时候要重新赋值一个新数组，而不能自作聪明去arr.length = 0，因为引用关系很复杂。 

1. useState中，更新的逻辑是可以用之前update里给wipRoot赋值的逻辑。update函数先不删除，因为React的flushSync好像就是强制刷新页面用的。

2. 把stateHooks存到当前的fiber上。触发setter函数重新给wipRoot赋值，进而调用render函数重新渲染页面。调用render函数的时候，又会执行useState。oldHook根据alternate.stateHooks和stateHookIndex拿到，这次就会检测到当前oldHook是有值的，oldHook有值就不用初始值了。

今天状态：😊总体来说今天内容不多

经验 + 10

