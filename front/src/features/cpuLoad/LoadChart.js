import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshLoadAsync, selectCurrentLoad, selectHistory } from './loadSlice'
import { timeFormatter } from '../../services/formatter'
import LoadMetric from './LoadMetric'
import styles from './LoadFeature.module.css'

import { LineChart, ResponsiveContainer, Line, XAxis, YAxis } from 'recharts'

const LoadChart = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshLoadAsync())
    const pollster = setInterval(() => dispatch(refreshLoadAsync()), 10000)
    return () => clearInterval(pollster)
  }, [dispatch])

  const currentLoad = useSelector(selectCurrentLoad)
  const history = useSelector(selectHistory)

  let xLabels
  if (history.length > 1) {
    xLabels = [history[0].time, history[history.length - 1].time]
  }

  return <div className={styles.loadChartContainer}>
    <LoadMetric currentLoad={currentLoad} />
    <div className={styles.loadChart}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <Line animationDuration={500} dot={false} type="stepAfter" dataKey="load" stroke="#000" strokeWidth={2} />
          <XAxis dataKey="time" tickFormatter={timeFormatter} ticks={xLabels} strokeWidth={2} />
          <YAxis strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
}

export default LoadChart