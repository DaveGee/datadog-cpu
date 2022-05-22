import { useState } from 'react'
import { useSelector } from "react-redux"
import { 
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  Scatter
} from "recharts"
import { isHighLoadEvent, isRecoveryEvent } from "./alertingRules"
import { selectRecentEvents } from "./loadSlice"
import { timeFormatter } from "../../services/formatter"
import styles from './LoadTimeline.module.css'

// Component to display the tooltip of the events in the timeline
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const event = payload[0].payload
    return (
      <div className={styles.customTooltip}>
        <p>{`time : ${timeFormatter(event.time)}`}</p>
        <p>
          {
            isHighLoadEvent(event) ?
              "HIGHLOAD DETECTED"
              : "RECOVERED FROM HIGH LOAD"
          }
        </p>
      </div>
    )
  }

  return null
}

// options of the visualization of the timeline
const ONE_HOUR = 60 * 60 * 1000
const THREE_HOURS = 3 * ONE_HOUR
const ONE_DAY = 24 * ONE_HOUR

const options = [
  {
    duration: ONE_HOUR,
    label: '1h',
  },
  {
    duration: THREE_HOURS,
    label: '3h'
  },
  {
    duration: ONE_DAY,
    label: '1d'
  },
]

const LoadTimeline = () => {
  const [timeWindowMs, setTimeWindow] = useState(ONE_HOUR)

  const now = Date.now()
  const events = useSelector(selectRecentEvents(timeWindowMs))

  // index is the YAxis value. So all indicators are shown at the same height
  const data = events.map(e => ({
    ...e,
    index: 1
  }))

  const highload = data.filter(isHighLoadEvent)
  const recoveries = data.filter(isRecoveryEvent)

  const title = timeWindowMs === ONE_HOUR ? 
    "last hour" : (
      timeWindowMs === THREE_HOURS ?
        "last 3h" :
        "last 24h"
    )

  return (
    <div className={styles.eventTimeline}>
      <div className={styles.eventTimelineSelector}>
        <span>event timeline</span>
        <span>
          {
            options.map((o, i) => (
              <button key={i}
                className={timeWindowMs === o.duration ? styles.activeSelector : null}
                onClick={e => setTimeWindow(o.duration)}
              >
                {o.label}
              </button>
            ))
          }
        </span>
      </div>
      <ResponsiveContainer width="100%" height={60} >
        <ScatterChart
          height={60}
          margin={{
            top: 10,
            right: 30,
            bottom: 0,
            left: 0,
          }}>
          <XAxis
            type="number"
            dataKey="time"
            name="time"
            domain={[now - timeWindowMs, now]}
            tick={{ fontSize: 0 }}
            tickSize={0}
            tickFormatter={timeFormatter} 
          />

          <YAxis
            type="number"
            dataKey="index"
            name="1h"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: title, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="high load alerts" data={highload} shape="triangle" />
          <Scatter name="recoveries" data={recoveries} fill="white" stroke="black" />

        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )

}

export default LoadTimeline