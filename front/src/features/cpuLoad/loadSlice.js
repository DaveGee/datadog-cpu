import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoadMetric } from '../../services/loadAPI'

const MAX_HISTORY_MINUTES = 10
const LOAD_THRESHOLD = 1.0

const initialState = {
  currentLoad: 0,
  loadHistory: [],
}

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

        state.loadHistory.push(newSample)

        const oldest = state.loadHistory[0]
        if (newSample.time - oldest.time > MAX_HISTORY_MINUTES * 60 * 1000) {
          state.loadHistory.shift()
        }
      })
  }
})

export const selectCurrentLoad = state => state.cpuLoad.currentLoad

export default loadSlice.reducer