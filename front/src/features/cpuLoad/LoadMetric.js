import styles from './LoadFeature.module.css'
import { cpuLoadFormatter } from '../../services/formatter'

const LoadMetric = ({
  currentLoad
}) => (
  <dl className={styles.loadMetric}>
    <dt>current CPU load</dt>
    <dd>{cpuLoadFormatter(currentLoad)}</dd>
  </dl>
)

export default LoadMetric