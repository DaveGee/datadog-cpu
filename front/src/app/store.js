import { configureStore } from '@reduxjs/toolkit'
import loadReducer from '../features/cpuLoad/loadSlice'

const reducer = {
  cpuLoad: loadReducer
}

const buildStore = preloadedState => configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
})

export const store = buildStore()
export const getStore = preloadedState => buildStore(preloadedState)