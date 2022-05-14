import { configureStore } from '@reduxjs/toolkit'
import loadReducer from '../features/cpuLoad/loadSlice'

export const store = configureStore({
  reducer: {
    cpuLoad: loadReducer,
  },
})
