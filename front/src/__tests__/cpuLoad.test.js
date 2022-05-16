import loadReducer, { refreshLoadAsync } from '../features/cpuLoad/loadSlice'

describe('CPU load reducer should', () => {

  const initialState = {
    currentLoad: 0,
    loadHistory: []
  }

  const buildRefreshAction = normalizedLoad => ({
    type: refreshLoadAsync.fulfilled.type,
    payload: { normalizedLoad }
  })

  test('handle initial state', () => {
    expect(
      loadReducer(undefined, { type: 'unknown' })
    ).toEqual(
      initialState
    )
  })

  test('store the last metric as the "current load"', () => {
    let state = loadReducer(initialState, buildRefreshAction(0.1))
    state = loadReducer(state, buildRefreshAction(0.2))

    expect(state).toMatchObject({
      currentLoad: 0.2
    })
  })

  test('keep a 10min windows of the normalized load', async () => {

    const sampleInterval = 10 // seconds
    const sampleSize = (10 * 60) / sampleInterval // 10 min * 60s / 10s
    
    let state = loadReducer(initialState, buildRefreshAction(0))
    for(let i = 0; i < sampleSize; i++) {
      state = loadReducer(state, buildRefreshAction(i))
    }
    state = loadReducer(state, buildRefreshAction(100))

    expect(state).toEqual({
      currentLoad: 100,
      loadHistory: expect.any(Array)
    })
    expect(state.loadHistory.length).toBe(60)
    expect(state.loadHistory[59]).toBe(100)
    expect(state.loadHistory[0]).toBe(1)
  })
})

