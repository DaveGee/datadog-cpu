import { timeFormatter, cpuLoadFormatter } from '../../services/formatter'
import styles from './LoadFeature.module.css'
import { 
  ComposedChart, 
  ResponsiveContainer, 
  Line, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  Tooltip,
  Label,
  Scatter,
} from 'recharts'
import React from 'react'
import { HIGH_LOAD_EVENT_TYPE, RECOVERY_EVENT_TYPE } from './alertingRules'

export const tooltipFormatter = (load, name, props) => {
  if (name === 'load') {
    return cpuLoadFormatter(load)
  }
  if (name === 'recovery') {
    return 'below 1.0 for 2 minutes'
  }
  if (name === 'high load') {
    return 'above 1.0 for 2 minutes'
  }
}


const LoadChart = ({
  history
}) => {

  let window = [0, 0]
  if (history && history.length > 1) {
    window = [history[0].time, history[history.length - 1].time]
  }

  // add data (alert and recovered) to be able to show the events at a specific Y value
  const data = history.map(sample => ({
    ...sample,
    alert: sample.raised === HIGH_LOAD_EVENT_TYPE ? 1 : null,
    recovered: sample.raised === RECOVERY_EVENT_TYPE ? 1 : null,
  }))

  return (
    <div className={styles.loadChart}>
      <ResponsiveContainer width="100%" height="100%" >
        <ComposedChart data={data} margin={{ top: 30, left: 30, bottom: 30, right: 30 }}>
          <Tooltip formatter={tooltipFormatter} labelFormatter={timeFormatter} itemStyle={{color: 'black'}} />
          <ReferenceLine y={1} stroke="black" strokeDasharray="5 2" />
          <XAxis type="number" dataKey="time" tickFormatter={timeFormatter} domain={window} ticks={window} strokeWidth={2} dy={10}>
            <Label value="last 10 minutes" position="insideBottom" />
          </XAxis>
          <YAxis strokeWidth={2} type="number">
            <Label value="normalized CPU load" position="insideLeft" dx={-10} textAnchor='middle' angle={-90} />
          </YAxis>
          <Scatter dataKey="alert" shape="triangle" name="high load" />
          <Scatter dataKey="recovered" fill="white" stroke="black" name="recovery" />
          <Line name="load" animationDuration={500} dot={false} type="stepAfter" dataKey="load" stroke="#000" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LoadChart