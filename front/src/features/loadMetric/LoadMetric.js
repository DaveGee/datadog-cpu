import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentLoad } from './loadSlice'
import styles from './LoadMetric.module.css'

const LoadMetric = () => {

    const currentLoad = useSelector(selectCurrentLoad)

    return <div className={styles.metricContainer}>
        <span className={styles.metricLabel}>Current load</span>
        <span className={styles.metricValue}>{currentLoad}</span>
    </div>
}

export default LoadMetric