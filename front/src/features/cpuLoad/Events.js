
import styles from './LoadFeature.module.css'

const LoadEvents = ({
  highLoad,
  recoveries
}) => (
  <dl className={styles.events}>
    <dt>Alerts</dt>
    <dd>{highLoad.length}</dd>
    <dt>Recoveries</dt>
    <dd>{recoveries.length}</dd>
  </dl>
)

export default LoadEvents