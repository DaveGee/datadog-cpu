import styles from './LoadFeature.module.css'

const LoadMetric = ({
  currentLoad
}) => (
  <dl className={styles.loadMetric}>
    <dt>Current load</dt>
    <dd>{currentLoad}</dd>
  </dl>
)

export default LoadMetric