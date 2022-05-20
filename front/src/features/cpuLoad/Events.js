
import styles from './LoadFeature.module.css'

const LoadEvents = ({
  highLoad,
  recoveries
}) => (
  <dl className={styles.events}>
    <dt>high load alerts</dt>
    <dd>{highLoad.length}</dd>
    <dt>recoveries</dt>
    <dd>{recoveries.length}</dd>
  </dl>
)

export default LoadEvents