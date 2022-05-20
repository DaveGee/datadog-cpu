import React from 'react'
import './App.css'
import LoadFeature from './features/cpuLoad/LoadFeature'

function App() {
  return (
    <div className="App">
      <h1>
        datadog CPU load monitoring
      </h1>
      <LoadFeature />
    </div>
  )
}

export default App
