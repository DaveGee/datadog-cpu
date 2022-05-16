import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshLoadAsync, selectCurrentLoad } from './loadSlice'
import styles from './LoadChart.module.css'

const LoadChart = () => {

  const dispatch = useDispatch()

  const currentLoad = useSelector(selectCurrentLoad)

  useEffect(() => {
    dispatch(refreshLoadAsync())
    const pollster = setInterval(() => dispatch(refreshLoadAsync()), 10000)

    return () => clearInterval(pollster)
  }, [dispatch])

  return <div className={styles.loadChartContainer}>
    <h2>CPU Load: 10 minute window</h2>
    <span className={styles.metricLabel}>Current load</span>
    <span className={styles.metricValue}>{currentLoad}</span>
  </div>
}

export default LoadChart