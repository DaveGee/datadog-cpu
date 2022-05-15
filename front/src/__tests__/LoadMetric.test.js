import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import LoadMetric from '../features/cpuLoad/LoadMetric'
import { refreshLoadAsync } from '../features/cpuLoad/loadSlice'
import { baseUrl } from '../config'

describe('The Load Metric should', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  test('display 0 by default', () => {
    render(
      <Provider store={store}>
        <LoadMetric />
      </Provider>
    )

    expect(screen.getByText('Current load')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('call the load API to get the value on refresh action', async () => {

    fetch.mockResponseOnce(JSON.stringify({
      "numCpus": 8,
      "load1": 1.16,
      "normalizedLoad": 0.14
    }))

    store.dispatch(refreshLoadAsync())

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(baseUrl + 'load')

    await waitFor(() => {
      expect(store.getState().cpuLoad.currentLoad).toEqual(0.14)
    })
  })

  test('display the CPU load fetched from the backend', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      "numCpus": 8,
      "load1": 1.16,
      "normalizedLoad": 0.14
    }))

    render(
      <Provider store={store}>
        <LoadMetric />
      </Provider>
    )

    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual(baseUrl + 'load')

    await waitFor(() => {
      expect(screen.getByText('0.14')).toBeInTheDocument()
    })
  })
})
