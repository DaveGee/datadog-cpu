import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshLoadAsync, selectCurrentLoad } from './loadSlice'
import styles from './LoadMetric.module.css'

const LoadMetric = () => {

  const dispatch = useDispatch()

  const currentLoad = useSelector(selectCurrentLoad)

  useEffect(() => {
    dispatch(refreshLoadAsync())
    const pollster = setInterval(() => dispatch(refreshLoadAsync()), 10000)

    return () => clearInterval(pollster)
  }, [dispatch])

  return <div className={styles.metricContainer}>
    <span className={styles.metricLabel}>Current load</span>
    <span className={styles.metricValue}>{currentLoad}</span>
  </div>
}

export default LoadMetric