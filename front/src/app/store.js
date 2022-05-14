import { configureStore } from '@reduxjs/toolkit'
import loadReducer from '../features/loadMetric/loadSlice'

export const store = configureStore({
  reducer: {
    loadMetric: loadReducer,
  },
})
