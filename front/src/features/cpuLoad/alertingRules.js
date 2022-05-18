
const LOAD_THRESHOLD = 1.0
const HIGH_LOAD_THRESHOLD = 2 * 60 * 1000
const RECOVERY_THRESHOLD = 2 * 60 * 1000

const MAX_HISTORY_WINDOW = 10 * 60 * 1000

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

export const maxLoadHistoryReached = (latestTime, oldestTime) => 
  latestTime - oldestTime > MAX_HISTORY_WINDOW