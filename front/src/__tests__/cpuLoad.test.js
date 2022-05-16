import loadReducer, { refreshLoadAsync } from '../features/cpuLoad/loadSlice'

describe('CPU load reducer should', () => {

  test('handle initial state', () => {
    expect(loadReducer(undefined, { type: 'unknown' })).toEqual({
      currentLoad: 0,
    })
  })

  test('store the last metric as the "current load"', async () => {
    expect(loadReducer({}, { 
      type: refreshLoadAsync.fulfilled.type, 
      payload: { normalizedLoad: 0.3 }
    })).toEqual({
      currentLoad: 0.3,
    })
  })
})

