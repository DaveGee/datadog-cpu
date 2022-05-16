import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import App from '../App'

describe('Monitoring app should', () => {
  test('display a cpu load chart', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(screen.getByText('CPU Load: 10 minute window')).toBeInTheDocument()
  })
})

