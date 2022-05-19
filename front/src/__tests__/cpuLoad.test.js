import loadReducer, { 
  refreshLoadAsync,
} from '../features/cpuLoad/loadSlice'
import {
  trackHeavyLoadDuration, 
  trackNormalLoadDuration
} from '../features/cpuLoad/alertingRules'

describe('CPU load reducer should', () => {

  const initialState = {
    currentLoad: 0,
    loadHistory: [],
    events: []
  }
  const testTime = new Date('2022-01-01')
  const testTimeMs = testTime.getTime()
  const sampleInterval = 10000

  const loadSampleWithHeavyLoad = [
    0.8, 0.6,
    1.1, 1.2, 1.3, 1.1, 1.5, 1.3, 1.4, 1.2, 1.1, 1.2, 1.3, 1.1, 1.5, 1.3,
    0.8, 0.7 
  ]

  const buildRefreshAction = normalizedLoad => ({
    type: refreshLoadAsync.fulfilled.type,
    payload: { normalizedLoad }
  })

  const buildMockedState = (sample, sampleInterval) => 
    sample.reduce((state, l) => {
      jest.advanceTimersByTime(sampleInterval)
      return loadReducer(state, buildRefreshAction(l))
    }, undefined)

  beforeEach(() => {
    jest.useRealTimers()
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

  test('keep a 10min window of the normalized load with 10s samples', () => {
    jest
      .useFakeTimers()
      .setSystemTime(testTime)
    
    const sample = [...Array(100).keys()]
    const state = buildMockedState(sample, sampleInterval)

    expect(state).toMatchObject({
      currentLoad: 99,
      loadHistory: expect.any(Array)
    })
    expect(state.loadHistory.length).toBe(61)
    expect(state.loadHistory[60].load).toBe(99)
    expect(state.loadHistory[0].load).toBe(39)
  })

  test('correctly get rid of ALL samples outside of the sampling window of 10min', () => {
    jest
      .useFakeTimers()
      .setSystemTime(testTime)
    
    const sample = [...Array(100).keys()]
    let state = buildMockedState(sample, sampleInterval)

    // get outside of the sampling window
    jest.advanceTimersByTime(20 * 60 * 1000)

    state = loadReducer(state, buildRefreshAction(5))

    expect(state).toMatchObject({
      currentLoad: 5,
      loadHistory: expect.any(Array)
    })
    expect(state.loadHistory.length).toBe(1)
    expect(state.loadHistory[0].load).toBe(5)
  })

  test('record api calls\' timestamps when sampling the normalized load from the server', () => {
    jest
      .useFakeTimers()
      .setSystemTime(testTime)

    const sample = [
      1, 2, 3, 4, 5, 6, 7
    ]
    const state = buildMockedState(sample, sampleInterval)

    expect(state.loadHistory[0].load).toBe(1)
    expect(state.loadHistory[0].time).toBe(testTimeMs + sampleInterval)
    expect(state.loadHistory[6].load).toBe(7)
    expect(state.loadHistory[6].time).toBe(testTimeMs + sampleInterval * sample.length)
  })

  test('keep track of heavy load trends', () => {
    jest
      .useFakeTimers()
      .setSystemTime(testTime)

    const state = buildMockedState(loadSampleWithHeavyLoad, sampleInterval)

    const firstLoadEventInTrend = testTimeMs + 3 * sampleInterval

    expect(state.loadHistory[0].load).toBe(0.8)
    expect(state.loadHistory[0].aboveThresholdSince).toBe(null)

    expect(state.loadHistory[2].load).toBe(1.1)
    expect(state.loadHistory[2].aboveThresholdSince).toBe(firstLoadEventInTrend)
    
    expect(state.loadHistory[14].load).toBe(1.5)
    expect(state.loadHistory[14].aboveThresholdSince).toBe(firstLoadEventInTrend)

    expect(state.loadHistory[17].load).toBe(0.7)
    expect(state.loadHistory[17].aboveThresholdSince).toBe(null)
  })

  test('keep track of recovery trends', () => {
    jest
      .useFakeTimers()
      .setSystemTime(testTime)

    const sample = [
      1.1, 1.5,
      0.8, 0.9, 0.1,
      1.0, 1.1
    ]
    const state = buildMockedState(sample, sampleInterval)

    const firstRecoverEventTime = testTimeMs + 3 * sampleInterval

    expect(state.loadHistory[0].load).toBe(1.1)
    expect(state.loadHistory[0].underThresholdSince).toBe(null)

    expect(state.loadHistory[2].load).toBe(0.8)
    expect(state.loadHistory[2].underThresholdSince).toBe(firstRecoverEventTime)
    
    expect(state.loadHistory[4].load).toBe(0.1)
    expect(state.loadHistory[4].underThresholdSince).toBe(firstRecoverEventTime)

    expect(state.loadHistory[6].load).toBe(1.1)
    expect(state.loadHistory[6].underThresholdSince).toBe(null)
  })

  describe('An alert should', () => {
    test('go off when high load is detected for more than 2 minutes', () => {
      jest
        .useFakeTimers()
        .setSystemTime(testTime)

      const alertSample = [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
      ]

      const state = buildMockedState(alertSample, sampleInterval)

      const TIME_OF_SAMPLE_RAISING_ALERT = testTimeMs + 13 * sampleInterval

      expect(state.events.length).toBe(1)
      expect(state.events[0].time).toBe(TIME_OF_SAMPLE_RAISING_ALERT)
      expect(state.events[0].type).toBe('HIGH_LOAD')
    })
  
    test('be closed when the CPU recovers for more than 2 minutes', () => {
      jest
        .useFakeTimers()
        .setSystemTime(testTime)

      const recoverySample = [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
      ]

      const state = buildMockedState(recoverySample, sampleInterval)

      const TIME_OF_SAMPLE_RECOVERING = testTimeMs + 26 * sampleInterval

      expect(state.events.length).toBe(2)
      expect(state.events[1].time).toBe(TIME_OF_SAMPLE_RECOVERING)
      expect(state.events[1].type).toBe('RECOVERY')
    })
  
    test('not go off if an alert is already active', () => {
      jest
        .useFakeTimers()
        .setSystemTime(testTime)

      const recoverySample = [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
      ]

      const state = buildMockedState(recoverySample, sampleInterval)

      const TIME_OF_SAMPLE_RAISING_ALERT = testTimeMs + 13 * sampleInterval

      expect(state.events.length).toBe(1)
      expect(state.events[0].time).toBe(TIME_OF_SAMPLE_RAISING_ALERT)
      expect(state.events[0].type).toBe('HIGH_LOAD')
    })
  })
})

describe('Heavy load history tracker should', () => {

  test('not need a previous sample to start counting high load duration', () => {
    expect(
      trackHeavyLoadDuration(
        null, 
        1.0, 
        200
      )
    ).toBe(200)
  })

  test.each([
    {
      test: 'see 1 as a high load', 
      aboveThresholdSince: null, currentLoad: 1.0, currentTime: 200, trackedTime: 200
    },
    {
      test: 'not track when load is under 1', 
      aboveThresholdSince: 100, currentLoad: 0.1, currentTime: 200, trackedTime: null
    },
    {
      test: 'record time when load passes the threshold for the first time', 
      aboveThresholdSince: null, currentLoad: 1.1, currentTime: 100, trackedTime: 100
    },
    {
      test: 'keep start-of-trend record when load was already high', 
      aboveThresholdSince: 50, currentLoad: 1.1, currentTime: 100, trackedTime: 50
    },
  ])('$test', ({ aboveThresholdSince, currentLoad, currentTime, trackedTime}) => {
    expect(
      trackHeavyLoadDuration(
        { aboveThresholdSince }, 
        currentLoad, 
        currentTime
      )
    ).toBe(trackedTime)
  })
})

describe('Recovery history tracker should', () => {

  test('not need a previous sample to track recovery situations', () => {
    expect(
      trackNormalLoadDuration(
        null, 
        0.1, 
        200
      )
    ).toBe(200)
  })

  test.each([
    {
      test: 'not see 1 as a high load', 
      underThresholdSince: null, currentLoad: 1.0, currentTime: 200, trackedTime: null
    },
    {
      test: 'not track when load is above 1', 
      underThresholdSince: 100, currentLoad: 1.1, currentTime: 200, trackedTime: null
    },
    {
      test: 'record time when load passes the threshold for the first time', 
      underThresholdSince: null, currentLoad: 0.1, currentTime: 100, trackedTime: 100
    },
    {
      test: 'keep start-of-trend record when load was already low', 
      underThresholdSince: 50, currentLoad: 0.1, currentTime: 100, trackedTime: 50
    },
  ])('$test', ({ underThresholdSince, currentLoad, currentTime, trackedTime}) => {
    expect(
      trackNormalLoadDuration(
        { underThresholdSince }, 
        currentLoad, 
        currentTime
      )
    ).toBe(trackedTime)
  })
})