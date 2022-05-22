/**
 * Mostly business rules extracted to be re-usable more easily (or tested more easily)
 */

const LOAD_THRESHOLD = 1.0
// 2 minutes over 1.0 => high load alert
const HIGH_LOAD_THRESHOLD = 2 * 60 * 1000
// 2 minutes under 1.0 => for a recovery
const RECOVERY_THRESHOLD = 2 * 60 * 1000

// how much history do we keep
const MAX_HISTORY_WINDOW = 10 * 60 * 1000

export const HIGH_LOAD_EVENT_TYPE = 'HIGH_LOAD'
export const RECOVERY_EVENT_TYPE = 'RECOVERY'

/**
 * Returns a time since when we are considered under "high CPU load", based on previous samples
 * @returns a time (in unix timestamp)
 */
export const trackHeavyLoadDuration = (previousSample, currentLoad, currentTime) => {
  if (currentLoad >= LOAD_THRESHOLD) {
    if (previousSample && previousSample.aboveThresholdSince)
      return previousSample.aboveThresholdSince

    return currentTime
  }
  return null
}

/**
 * Returns a time since when we are considered under "normal CPU conditions", based on previous samples
 * @returns a time (in unix timestamp)
 */
export const trackNormalLoadDuration = (previousSample, currentLoad, currentTime) => {
  if (currentLoad < LOAD_THRESHOLD) {
    if (previousSample && previousSample.underThresholdSince)
      return previousSample.underThresholdSince
    
    return currentTime
  }
  return null
}

/**
 * Should the system raise a high load alert given history?
 * @returns whether or not an alert should be raised
 */
export const shouldTriggerHighLoadAlert = (aboveThresholdSince, timeNow, hasNoActiveAlert) => {
  if (!aboveThresholdSince)
    return false

  return timeNow - aboveThresholdSince >= HIGH_LOAD_THRESHOLD && hasNoActiveAlert
}

/**
 * Should the system raise a recovery event given history?
 * @returns whether or not a recovery is detected
 */
export const shouldRecover = (underThresholdSince, timeNow, hasActiveAlert) => {
  if (!underThresholdSince)
    return false

  return timeNow - underThresholdSince >= RECOVERY_THRESHOLD && hasActiveAlert
}

export const maxHistoryWindow = () => MAX_HISTORY_WINDOW

export const selectLastEvent = state => state.events.length > 0 ? state.events[state.events.length - 1] : null
export const selectOldestSample = state => state.loadHistory[0]

/**
 * Is an alert currently active?
 * @returns true if the last event was a recovery
 */
export const hasNoActiveAlert = state => (
  state.events.length === 0
  || selectLastEvent(state).type === RECOVERY_EVENT_TYPE
)
/**
 * Is an alert currently active?
 * @returns true if the last event was an alert
 */
export const hasActiveAlert = state => (
  state.events.length > 0 
  && selectLastEvent(state).type === HIGH_LOAD_EVENT_TYPE
)

/**
 * Helper to create a recovery event
 */
export const newRecoveryEvent = time => ({
  time,
  type: RECOVERY_EVENT_TYPE
})
/**
 * Helper to create a high load alert event
 */
export const newHighLoadEvent = time => ({
  time,
  type: HIGH_LOAD_EVENT_TYPE
})

export const isHighLoadEvent = event => event.type === HIGH_LOAD_EVENT_TYPE
export const isRecoveryEvent = event => event.type === RECOVERY_EVENT_TYPE