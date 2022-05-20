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

    expect(screen.getByText('current CPU load')).toBeInTheDocument()
  })

  test('render consistently', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(container).toMatchSnapshot()
  })
})

