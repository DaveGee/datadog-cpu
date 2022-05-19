import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  refreshLoadAsync,
  injectTestData,
  selectCurrentLoad, 
  selectHistory,
  selectHighLoadEvents,
  selectRecoveryEvents,
  selectRecentEvents
} from './loadSlice'
import LoadMetric from './LoadMetric'
import Events from './Events'
import LoadChart from './LoadChart'
import styles from './LoadFeature.module.css'

const LoadFeature = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshLoadAsync())
    const pollster = setInterval(() => dispatch(refreshLoadAsync()), 10000)
    return () => clearInterval(pollster)
  }, [dispatch])

  const currentLoad = useSelector(selectCurrentLoad)
  const history = useSelector(selectHistory)
  const highLoad = useSelector(selectHighLoadEvents)
  const recoverEvents = useSelector(selectRecoveryEvents)

  const recentEvents = useSelector(selectRecentEvents(10 * 60 * 1000))

  return (
    <div className={styles.loadChartContainer}>
      <div className={styles.metrics}>
        <Events highLoad={highLoad} recoveries={recoverEvents} />
        <LoadMetric currentLoad={currentLoad} />
      </div>
      <LoadChart history={history} recentEvents={recentEvents} />
      <div>
        <button onClick={e => dispatch(injectTestData())}>Simulate</button>
      </div>
    </div>
  )
}

export default LoadFeature