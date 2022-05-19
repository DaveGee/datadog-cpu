import { timeFormatter } from '../../services/formatter'
import styles from './LoadFeature.module.css'
import { 
  LineChart, 
  ResponsiveContainer, 
  Line, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  ReferenceDot 
} from 'recharts'
import React from 'react'

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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <Line animationDuration={500} dot={false} type="stepAfter" dataKey="load" stroke="#000" strokeWidth={2} />
          <ReferenceLine y={1} stroke="black" strokeDasharray="5 2" />
          {
            recentEvents && recentEvents.map(event => (
              <React.Fragment key={event.time}>
                <ReferenceLine x={event.time} stroke="gray" strokeDasharray="1 3" />
                <ReferenceDot x={event.time} y={1} r={5} stroke="black" />
              </React.Fragment>
            ))
          }
          <XAxis dataKey="time" tickFormatter={timeFormatter} ticks={xLabels} strokeWidth={2} name="Time" />
          <YAxis strokeWidth={2} name="Normalized Load" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LoadChart