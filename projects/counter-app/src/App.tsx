import './App.css'
import Viewer from './components/Viewer'
import Controlles from './components/Controller'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const onClickButton = (value: number) => {
    setCount(count + value)
  }

  return (
    <div className='App'>
      <h1>Simple Counter</h1>

      <section>
        <Viewer count={count}/>
      </section>

      <section>
        <Controlles onClickButton={onClickButton}/>
      </section>
    </div>
  )
}

export default App
