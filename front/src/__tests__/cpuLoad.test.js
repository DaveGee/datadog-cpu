import loadReducer from '../features/cpuLoad/loadSlice'

describe('load metric reducer should', () => {

  test('handle initial state', () => {
    expect(loadReducer(undefined, { type: 'unknown' })).toEqual({
      currentLoad: 0,
    })
  })
})

