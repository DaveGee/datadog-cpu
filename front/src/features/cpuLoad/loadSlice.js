import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoadMetric } from '../../services/loadAPI'
import {
  trackHeavyLoadDuration,
  trackNormalLoadDuration,
  shouldRecover,
  shouldTriggerHighLoadAlert,
  maxLoadHistoryReached,
  newHighLoadEvent,
  newRecoveryEvent,
  hasNoActiveAlert,
  hasActiveAlert,
  selectOldestSample,
  isRecoveryEvent,
  isHighLoadEvent
} from './alertingRules'

const initialState = {
  currentLoad: 0,
  loadHistory: [],
  events: []
}

export const selectCurrentLoad = state => state.cpuLoad.currentLoad
export const selectHistory = state => state.cpuLoad.loadHistory
export const selectRecoveryEvents = state => state.cpuLoad.events.filter(isRecoveryEvent)
export const selectHighLoadEvents = state => state.cpuLoad.events.filter(isHighLoadEvent)

export const refreshLoadAsync = createAsyncThunk(
  'cpuLoad/fetchLoad',
  async () => await fetchLoadMetric()
)

export const loadSlice = createSlice({
  name: 'cpuLoad',
  initialState,
  reducers: {},
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

        const oldest = selectOldestSample(state)
        if (maxLoadHistoryReached(newSample.time, oldest.time)) {
          state.loadHistory.shift()
        }
      })
  }
})

export default loadSlice.reducer