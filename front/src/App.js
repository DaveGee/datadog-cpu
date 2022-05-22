import React from 'react'
import './App.css'
import LoadFeature from './features/cpuLoad/LoadFeature'
import LoadTimeline from './features/cpuLoad/LoadTimeline'

function App() {
  return (
    <div className="App">
      <h1>
        datadog CPU load monitoring
      </h1>
      <LoadFeature />
      <LoadTimeline />
    </div>
  )
}

export default App
