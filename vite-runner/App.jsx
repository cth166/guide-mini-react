import React from '../core/React'

function App() {
  console.log('app render')
  const [count, setCount] = React.useState(10)
  const [name, setName] = React.useState('wyq')

  function handleClick() {
    // setCount(c => c + 1)
    // setName(n => n + ' -love')
    setName('wyq')
  }

  return (
    <div>
      <h1>App</h1>
      <h2>{count}</h2>
      <h2>{name}</h2>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}

export default App
