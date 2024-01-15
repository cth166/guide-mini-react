import React from '../core/React'

function Counter({ num }) {
  return <h1>Count:{num}</h1>
}

function App() {
  return (
    <div>
      <div>love wyq</div>
      <Counter num={86} />
    </div>
  )
}

export default App
