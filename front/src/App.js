import React from 'react'
import './App.css'
import Load from './features/cpuLoad/Load'

function App() {
  return (
    <div className="App">
      <h1>
        datadog CPU load monitoring
      </h1>
      <Load />
    </div>
  )
}

export default App
