import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoadMetric } from './loadAPI'

const initialState = {
  currentLoad: 0,
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
        state.currentLoad = action.payload.normalizedLoad || 0
      })
  }
})

export const selectCurrentLoad = state => state.cpuLoad.currentLoad

export default loadSlice.reducer