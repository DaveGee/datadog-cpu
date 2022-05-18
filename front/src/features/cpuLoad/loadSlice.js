import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoadMetric } from '../../services/loadAPI'
import {
  trackHeavyLoadDuration,
  trackNormalLoadDuration,
  shouldRecover,
  shouldTriggerHighLoadAlert,
  maxLoadHistoryReached
} from './alertingRules'

const HIGH_LOAD_EVENT_TYPE = 'HIGH_LOAD'
const RECOVERY_EVENT_TYPE = 'RECOVERY'

const initialState = {
  currentLoad: 0,
  loadHistory: [],
  events: []
}

export const selectCurrentLoad = state => state.cpuLoad.currentLoad
export const selectLastEvent = state => state.events.length > 0 ? state.events[state.events.length - 1] : null
export const hasNoActiveAlert = state => (
  state.events.length === 0
  || selectLastEvent(state).type === RECOVERY_EVENT_TYPE
)
export const hasActiveAlert = state => (
  state.events.length > 0 
  && selectLastEvent(state).type === HIGH_LOAD_EVENT_TYPE
)

export const selectOldestSample = state => state.loadHistory[0]

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
          state.events.push({
            time: now,
            type: HIGH_LOAD_EVENT_TYPE
          })
        }

        if(shouldRecover(underThresholdSince, now, hasActiveAlert(state))) {
          state.events.push({
            time: now,
            type: RECOVERY_EVENT_TYPE
          })
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