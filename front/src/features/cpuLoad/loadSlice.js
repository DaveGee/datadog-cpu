import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoadMetric } from '../../services/loadAPI'
import {
  trackHeavyLoadDuration,
  trackNormalLoadDuration,
  shouldRecover,
  shouldTriggerHighLoadAlert,
  newHighLoadEvent,
  newRecoveryEvent,
  hasNoActiveAlert,
  hasActiveAlert,
  isRecoveryEvent,
  isHighLoadEvent,
  maxHistoryWindow,
  HIGH_LOAD_EVENT_TYPE,
  RECOVERY_EVENT_TYPE
} from './alertingRules'
import { generateShowCaseHistory, generateShowCaseEvents } from './showCaseData'

const initialState = {
  currentLoad: 0,
  loadHistory: [],
  events: []
}

export const selectCurrentLoad = state => state.cpuLoad.currentLoad
export const selectHistory = state => state.cpuLoad.loadHistory
export const selectRecoveryEvents = state => state.cpuLoad.events.filter(isRecoveryEvent)
export const selectHighLoadEvents = state => state.cpuLoad.events.filter(isHighLoadEvent)
export const selectRecentEvents = timeIntervalMs => {
  const now = Date.now()
  return state => state.cpuLoad.events.filter(ev => now - ev.time < timeIntervalMs)
}
export const selectOpenAlert = state => {
  const lastEvent = state.cpuLoad.events[state.cpuLoad.events.length - 1]
  if (lastEvent && isHighLoadEvent(lastEvent)) {
    return lastEvent
  }
  return null
}
export const selectNewEvents = state => state.cpuLoad.events.filter(e => !e.notified)

export const refreshLoadAsync = createAsyncThunk(
  'cpuLoad/fetchLoad',
  async () => await fetchLoadMetric()
)

export const loadSlice = createSlice({
  name: 'cpuLoad',
  initialState,
  reducers: {
    silence: (state, action) => {
      const event = action.payload

      state.events
        .filter(e => e.time === event.time && e.type === event.type)
        .forEach(e => {
          e.notified = true
        })
    },
    injectTestData: (state) => {
      state.events = generateShowCaseEvents()
      state.loadHistory = generateShowCaseHistory()
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshLoadAsync.fulfilled, (state, action) => {
        const normalizedLoad = action.payload.normalizedLoad || 0

        state.currentLoad = normalizedLoad

        // get the last sample, if any, in order to detect recovery and high load events
        const previousSample = state.loadHistory[state.loadHistory.length - 1]

        // remember since when we are above or under threshold, to detect when we pass the 2minutes interval required to fire a load event
        const now = Date.now()
        const aboveThresholdSince = trackHeavyLoadDuration(previousSample, normalizedLoad, now)
        const underThresholdSince = trackNormalLoadDuration(previousSample, normalizedLoad, now)

        const newSample = {
          load: normalizedLoad,
          time: now,
          aboveThresholdSince,
          underThresholdSince,
        }

        // Should we trigger high load or recovery events?
        // events themselves will be stored independently, and maintained beyond the 10min window
        if (shouldTriggerHighLoadAlert(aboveThresholdSince, now, hasNoActiveAlert(state))) {
          state.events.push(newHighLoadEvent(now))
          newSample.raised = HIGH_LOAD_EVENT_TYPE
        }

        if(shouldRecover(underThresholdSince, now, hasActiveAlert(state))) {
          state.events.push(newRecoveryEvent(now))
          newSample.raised = RECOVERY_EVENT_TYPE
        }

        // add the new sample to the history, and remove the samples that fall outside of the history window
        state.loadHistory.push(newSample)

        state.loadHistory = state.loadHistory.filter(sample => 
          sample.time >= now - maxHistoryWindow()
        )
      })
  }
})

export const { silence, injectTestData } = loadSlice.actions
export default loadSlice.reducer