import { timeFormatter } from '../../services/formatter'
import styles from './LoadFeature.module.css'

import { LineChart, ResponsiveContainer, Line, XAxis, YAxis } from 'recharts'

const LoadChart = ({
  history
}) => {

  let xLabels
  if (history && history.length > 1) {
    xLabels = [history[0].time, history[history.length - 1].time]
  }

  return (
    <div className={styles.loadChart}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <Line animationDuration={500} dot={false} type="stepAfter" dataKey="load" stroke="#000" strokeWidth={2} />
          <XAxis dataKey="time" tickFormatter={timeFormatter} ticks={xLabels} strokeWidth={2} />
          <YAxis strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LoadChart