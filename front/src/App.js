import React from 'react'
import LoadMetric from './features/loadMetric/LoadMetric'
import './App.css'

function App() {
  return (
    <div className="App">
      <LoadMetric currentLoad={0.5543} />
    </div>
  )
}

export default App
