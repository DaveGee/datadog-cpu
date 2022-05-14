import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import App from '../App'

describe('App should', () => {
  
  test('display a load metric', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(screen.getByText('Current load')).toBeInTheDocument()
  })
})

