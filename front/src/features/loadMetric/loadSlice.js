import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentLoad: 0,
}

export const loadSlice = createSlice({
    name: 'loadMetric',
    initialState,
    reducers: {}
})

export const selectCurrentLoad = state => state.loadMetric.currentLoad

export default loadSlice.reducer