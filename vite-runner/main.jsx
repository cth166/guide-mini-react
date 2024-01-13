import React from '../core/React'
import ReactDom from '../core/ReactDom'
import App from './App'

console.log(<App className='heiheihei' />)

ReactDom.createRoot(document.querySelector('#root')).render(<App className='heiheihei' />)
