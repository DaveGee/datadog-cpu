/**
 * This provides a generator for "fake data" to be injected into the reducer, for demo purpose
 */

// 10min window => 61 samples (at 10s polling)
const sampleInput = [...Array(61).keys()]

// when in the array are the events
const HIGH_LOAD_EVENT_1 = 15
const HIGH_LOAD_EVENT_2 = 52
const RECOVERY_EVENT = 32

// generate a "realistic" load above or below the threshold based on the time
const generateLoad = i => {
  if (
    (i >= HIGH_LOAD_EVENT_1 - 12  && i <= HIGH_LOAD_EVENT_1 + 2) 
    || (i >= HIGH_LOAD_EVENT_2 - 12 && i <= HIGH_LOAD_EVENT_2 + 2)
  ) {
    return 1.01 + Math.random() * 0.5
  } else {
    return 0.15 + Math.random() * 0.5
  }
}

// is it a high load, or recovery event ?
const getEvent = i => {
  if (i === HIGH_LOAD_EVENT_1 || i === HIGH_LOAD_EVENT_2) {
    return 'HIGH_LOAD'
  }

  if (i === RECOVERY_EVENT) {
    return 'RECOVERY'
  }
  return null
}

// generate a 10min history once with an appropriate load (above or below 1.0) and event type
const loadSample = sampleInput.map(s => ({
  load: generateLoad(s),
  eventType: getEvent(s),
  position: s
}))

/**
 * Adapts the generated history graph to the current time, with correct entity types
 * @returns always the same "history", but shifted to now
 */
const generateData = () => {
  const now = Date.now()

  return loadSample.map(({ load, eventType, position }) => ({
    load,
    time: now - (61 - position) * 10000,
    event: {
      type: eventType,
      time: now - (61 - position) * 10000
    }
  }))
}

// exports a valid history to store into the reducer, based on the data above
export const generateShowCaseHistory = () => 
  generateData().map(({ load, time, event }) => ({ load, time, raised: event.type }))

const M = 60 * 1000
const H = 60 * 60 * 1000
const olderAlerts = [
  { type: 'RECOVERY', time: Date.now() - 30 * M, notified: true },
  { type: 'HIGH_LOAD', time: Date.now() - 33 * M, notified: true },
  { type: 'HIGH_LOAD', time: Date.now() - (4 * H + 8 * M), notified: true },
  { type: 'RECOVERY', time: Date.now() - 4 * H, notified: true },
  { type: 'HIGH_LOAD', time: Date.now() - (10 * H + 22 * M), notified: true },
  { type: 'RECOVERY', time: Date.now() - 10 * H, notified: true },
]

// exports valid events to store in the reducer, based on the data above
export const generateShowCaseEvents = () => 
  olderAlerts.concat(
    generateData()
      .filter(d => d.event.type)
      .map(({ event }) => ({ 
        type: event.type, 
        time: event.time 
      }))
  )