import React from 'react'
import LoadMetric from './features/cpuLoad/LoadMetric'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Datadog CPU load monitoring</h1>
      <LoadMetric currentLoad={0.5543} />
    </div>
  )
}

export default App
