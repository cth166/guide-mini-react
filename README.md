# Day1

- [x] 小步走。从直接操作`dom api`添加元素。慢慢抽象出虚拟节点的概念，最终递归地去调用render函数生成整个subTree。
- [x] 通过vitest快照测试代替手动测试。测试createElement的数据结构更可靠。
- [x] vite dev启动项目。碰见jsx语法，vite会自动转换成`React.createElement`。如果写`<App className='heiheihei' />`这种函数组件的结构是 type是一个函数类型，因此调用这个函数就可以拿到对应的vdom。这里先不考虑组件的props。

今天状态：😊

经验 + 10