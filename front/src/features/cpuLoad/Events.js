import { IoAlertCircleOutline } from 'react-icons/io5'
import { timeFormatter } from '../../services/formatter'
import styles from './LoadFeature.module.css'

const LoadEvents = ({
  highLoad,
  recoveries,
  openAlert
}) => (
  <dl className={styles.events}>
    <dt>high load alerts</dt>
    <dd>
      {highLoad.length}
      {
        openAlert && (
          <span className={styles.alertIndicator} data-text={"high load detected since " + timeFormatter(openAlert.time)}>
            <IoAlertCircleOutline />
          </span>
        )
      }
    </dd>
    <dt>recoveries</dt>
    <dd>{recoveries.length}</dd>
  </dl>
)

export default LoadEvents