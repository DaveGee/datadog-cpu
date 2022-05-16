import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoadMetric } from '../../services/loadAPI'

const initialState = {
  currentLoad: 0,
  loadHistory: []
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
        state.loadHistory.push(normalizedLoad)
        if (state.loadHistory.length > 60) {
          state.loadHistory.shift()
        }
      })
  }
})

export const selectCurrentLoad = state => state.cpuLoad.currentLoad

export default loadSlice.reducer