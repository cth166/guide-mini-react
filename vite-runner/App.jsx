import React from '../core/React'

let countFoo = 1
function Foo() {
  console.log('Foo render')
  const updater = React.update()
  function handleClick() {
    countFoo++
    updater()
  }

  return (
    <div>
      <h3>{countFoo}</h3>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}
let countBar = 1
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

let countApp = 1
function App() {
  console.log('App render')
  const updater = React.update()
  function handleClick() {
    countApp++
    updater()
  }

  return (
    <div>
      <h1>{countApp}</h1>
      <button onClick={handleClick}>+1</button>
      <Foo />
      <Bar />
    </div>
  )
}

export default App
