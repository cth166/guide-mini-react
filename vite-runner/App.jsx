import React from '../core/React'

let count = 10

function Counter({ num }) {

  function handleClick() {
    count++
    React.update()
  }

  return (
    <>
      <h2>Count:{count}</h2>
      <button onClick={handleClick}>+1</button>
    </>

  )
}

function App() {
  return (
    <div>
      <h1>love wyq</h1>
      <Counter num={10} />
      {/* <Counter num={20} /> */}
    </div>
  )
}

export default App
