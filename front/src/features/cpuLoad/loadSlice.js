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
  maxHistoryWindow
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

export const refreshLoadAsync = createAsyncThunk(
  'cpuLoad/fetchLoad',
  async () => await fetchLoadMetric()
)

export const loadSlice = createSlice({
  name: 'cpuLoad',
  initialState,
  reducers: {
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

        const previousSample = state.loadHistory[state.loadHistory.length - 1]

        const now = Date.now()
        const aboveThresholdSince = trackHeavyLoadDuration(previousSample, normalizedLoad, now)
        const underThresholdSince = trackNormalLoadDuration(previousSample, normalizedLoad, now)

        const newSample = {
          load: normalizedLoad,
          time: now,
          aboveThresholdSince,
          underThresholdSince,
        }

        if (shouldTriggerHighLoadAlert(aboveThresholdSince, now, hasNoActiveAlert(state))) {
          state.events.push(newHighLoadEvent(now))
        }

        if(shouldRecover(underThresholdSince, now, hasActiveAlert(state))) {
          state.events.push(newRecoveryEvent(now))
        }

        state.loadHistory.push(newSample)

        state.loadHistory = state.loadHistory.filter(sample => 
          sample.time >= now - maxHistoryWindow()
        )
      })
  }
})

export const { injectTestData } = loadSlice.actions
export default loadSlice.reducer