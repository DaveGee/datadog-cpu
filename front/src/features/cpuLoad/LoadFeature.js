import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  refreshLoadAsync,
  injectTestData,
  selectCurrentLoad, 
  selectHistory,
  selectHighLoadEvents,
  selectRecoveryEvents,
  selectOpenAlert
} from './loadSlice'
import LoadMetric from './LoadMetric'
import Events from './Events'
import LoadChart from './LoadChart'
import styles from './LoadFeature.module.css'
import LoadNotifications from './LoadNotifications'

const LoadFeature = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshLoadAsync())
    const pollster = setInterval(() => dispatch(refreshLoadAsync()), 10000)
    return () => clearInterval(pollster)
  }, [dispatch])

  const currentLoad = useSelector(selectCurrentLoad)
  const history = useSelector(selectHistory)
  const highLoadEvents = useSelector(selectHighLoadEvents)
  const recoveryEvents = useSelector(selectRecoveryEvents)
  const openAlert = useSelector(selectOpenAlert)

  return (
    <div className={styles.loadChartContainer}>
      <LoadNotifications />
      <div className={styles.metrics}>
        <Events highLoad={highLoadEvents} recoveries={recoveryEvents} openAlert={openAlert} />
        <LoadMetric currentLoad={currentLoad} />
        <button onClick={e => dispatch(injectTestData())}>simulate load</button>
      </div>
      <LoadChart history={history} />
    </div>
  )
}

export default LoadFeature