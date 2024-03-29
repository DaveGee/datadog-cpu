import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store, getStore } from '../app/store'
import LoadFeature from '../features/cpuLoad/LoadFeature'
import { refreshLoadAsync } from '../features/cpuLoad/loadSlice'
import { baseUrl } from '../config'
import { cpuLoadFormatter } from '../services/formatter'

describe('The Load widget should', () => {
  beforeEach(() => {
    fetch.resetMocks()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('display the current load', () => {
    render(
      <Provider store={store}>
        <LoadFeature />
      </Provider>
    )

    expect(screen.getByText('current CPU load')).toBeInTheDocument()
  })

  test('call the load API to get the value on refresh action', async () => {
    const mockedStore = getStore()

    fetch.mockResponseOnce(JSON.stringify({
      numCpus: 8,
      load1: 1.16,
      normalizedLoad: 0.14
    }))

    mockedStore.dispatch(refreshLoadAsync())

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(baseUrl + 'load')

    await waitFor(() => {
      expect(mockedStore.getState().cpuLoad.currentLoad).toEqual(0.14)
    })
  })

  test('display the CPU load fetched from the backend', async () => {
    const mockedStore = getStore()

    fetch.mockResponseOnce(JSON.stringify({
      numCpus: 8,
      load1: 1.16,
      normalizedLoad: 0.3
    }))
    
    render(
      <Provider store={mockedStore}>
        <LoadFeature />
      </Provider>
    )

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(baseUrl + 'load')

    await waitFor(() => {
      expect(screen.getByText(cpuLoadFormatter(0.3))).toBeInTheDocument()
    })
  })

  test('calls the backend every 10s', async () => {
    const mockedStore = getStore()

    jest.useFakeTimers()
    jest.spyOn(global, 'setInterval')

    fetch.mockResponse(JSON.stringify({
      numCpus: 8,
      load1: 1.16,
      normalizedLoad: 0.2
    }))

    render(
      <Provider store={mockedStore}>
        <LoadFeature />
      </Provider>
    )
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(baseUrl + 'load')

    expect(global.setInterval).toHaveBeenCalledTimes(1)
    
    jest.advanceTimersByTime(9000)
    expect(fetch.mock.calls.length).toEqual(1)

    jest.advanceTimersByTime(2000)
    expect(fetch.mock.calls.length).toEqual(2)

    await waitFor(() => {
      expect(screen.getByText(cpuLoadFormatter(0.2))).toBeInTheDocument()
    })
  })
})
