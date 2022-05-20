
const LOAD_THRESHOLD = 1.0
const HIGH_LOAD_THRESHOLD = 2 * 60 * 1000
const RECOVERY_THRESHOLD = 2 * 60 * 1000

const MAX_HISTORY_WINDOW = 10 * 60 * 1000

export const HIGH_LOAD_EVENT_TYPE = 'HIGH_LOAD'
export const RECOVERY_EVENT_TYPE = 'RECOVERY'


export const trackHeavyLoadDuration = (previousSample, currentLoad, currentTime) => {
  if (currentLoad >= LOAD_THRESHOLD) {
    if (previousSample && previousSample.aboveThresholdSince)
      return previousSample.aboveThresholdSince

    return currentTime
  }
  return null
}

export const trackNormalLoadDuration = (previousSample, currentLoad, currentTime) => {
  if (currentLoad < LOAD_THRESHOLD) {
    if (previousSample && previousSample.underThresholdSince)
      return previousSample.underThresholdSince
    
    return currentTime
  }
  return null
}

export const shouldTriggerHighLoadAlert = (aboveThresholdSince, timeNow, hasNoActiveAlert) => {
  if (!aboveThresholdSince)
    return false

  return timeNow - aboveThresholdSince >= HIGH_LOAD_THRESHOLD && hasNoActiveAlert
}

export const shouldRecover = (underThresholdSince, timeNow, hasActiveAlert) => {
  if (!underThresholdSince)
    return false

  return timeNow - underThresholdSince >= RECOVERY_THRESHOLD && hasActiveAlert
}

export const maxHistoryWindow = () => MAX_HISTORY_WINDOW


export const selectLastEvent = state => state.events.length > 0 ? state.events[state.events.length - 1] : null
export const selectOldestSample = state => state.loadHistory[0]

export const hasNoActiveAlert = state => (
  state.events.length === 0
  || selectLastEvent(state).type === RECOVERY_EVENT_TYPE
)
export const hasActiveAlert = state => (
  state.events.length > 0 
  && selectLastEvent(state).type === HIGH_LOAD_EVENT_TYPE
)

export const newRecoveryEvent = time => ({
  time,
  type: RECOVERY_EVENT_TYPE
})

export const newHighLoadEvent = time => ({
  time,
  type: HIGH_LOAD_EVENT_TYPE
})

export const isHighLoadEvent = event => event.type === HIGH_LOAD_EVENT_TYPE
export const isRecoveryEvent = event => event.type === RECOVERY_EVENT_TYPE