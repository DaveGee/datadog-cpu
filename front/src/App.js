import React from 'react'
import './App.css'
import LoadChart from './features/cpuLoad/LoadChart'

function App() {
  return (
    <div className="App">
      <h1>Datadog CPU load monitoring</h1>
      <LoadChart />
    </div>
  )
}

export default App
