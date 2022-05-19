/**
 * This provides a generator for "fake data" to be injected into the reducer, for demo purpose
 */

const HIGH_LOAD_EVENT_1 = 15
const HIGH_LOAD_EVENT_2 = 52
const RECOVERY_EVENT = 32

const sampleInput = [...Array(61).keys()]
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

const getEvent = i => {
  if (i === HIGH_LOAD_EVENT_1 || i === HIGH_LOAD_EVENT_2) {
    return 'HIGH_LOAD'
  }

  if (i === RECOVERY_EVENT) {
    return 'RECOVERY'
  }

  return null
}

const loadSample = sampleInput.map(s => ({
  load: generateLoad(s),
  eventType: getEvent(s),
  position: s
}))


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

export const generateShowCaseHistory = () => 
  generateData().map(({ load, time }) => ({ load, time }))

export const generateShowCaseEvents = () => 
  generateData()
    .filter(d => d.event.type)
    .map(({ event }) => ({ 
      type: event.type, 
      time: event.time 
    }))