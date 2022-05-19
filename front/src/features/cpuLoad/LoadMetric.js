import styles from './LoadFeature.module.css'

const LoadMetric = ({
  currentLoad
}) => (
  <>
    <span className={styles.metricLabel}>Current load</span>
    <span className={styles.metricValue}>{currentLoad}</span>
  </>
)

export default LoadMetric