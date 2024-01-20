import React from '../core/React'

function Count() {
  React.useEffect(() => {
    console.log('Count init')
  }, [])

  return <h1>Count</h1>
}


function App() {
  // console.log('app render')
  const [count, setCount] = React.useState(10)
  const [name, setName] = React.useState('wyq')

  function handleClick() {
    setCount(c => c + 1)
    setName(n => n + ' -love')
  }

  // React.useEffect(() => {
  //   console.log('name useEffect')
  // }, [name])

  React.useEffect(() => {
    console.log('count useEffect')
    return () => {
      console.log('count cleanup')
    }
  }, [count])

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
