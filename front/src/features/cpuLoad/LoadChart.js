import { timeFormatter, cpuLoadFormatter } from '../../services/formatter'
import styles from './LoadFeature.module.css'
import { 
  LineChart, 
  ResponsiveContainer, 
  Line, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  ReferenceDot,
  Tooltip
} from 'recharts'
import { HIGH_LOAD_EVENT_TYPE, RECOVERY_EVENT_TYPE } from './alertingRules'
import React from 'react'

const alertColors = {
  [HIGH_LOAD_EVENT_TYPE]: 'red',
  [RECOVERY_EVENT_TYPE]: 'green'
}

const LoadChart = ({
  history,
  recentEvents
}) => {

  let xLabels = [0, 0]
  if (history && history.length > 1) {
    xLabels = [history[0].time, history[history.length - 1].time]
  }

  return (
    <div className={styles.loadChart}>
      <ResponsiveContainer width="100%" height="100%" >
        <LineChart data={history} margin={{ top: 30, left: 30, bottom: 30, right: 30 }}>
          <Line animationDuration={500} dot={false} type="stepAfter" dataKey="load" stroke="#000" strokeWidth={2} />
          <Tooltip formatter={cpuLoadFormatter} labelFormatter={timeFormatter} />
          <ReferenceLine y={1} stroke="black" strokeDasharray="5 2" />
          <XAxis dataKey="time" tickFormatter={timeFormatter} ticks={xLabels} strokeWidth={2} label="last 10 minutes" dy={10} />
          <YAxis strokeWidth={2} label={{ value: 'normalized CPU load', angle: -90, position: 'insideLeft', dx: -10 }} />
          {
            recentEvents && recentEvents.map(event => (
              <React.Fragment key={event.time}>
                <ReferenceLine x={event.time} stroke={alertColors[event.type]} strokeDasharray="1 3" />
                <ReferenceDot x={event.time} y={1} r={5} stroke={alertColors[event.type]} strokeWidth={1} />
              </React.Fragment>
            ))
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LoadChart