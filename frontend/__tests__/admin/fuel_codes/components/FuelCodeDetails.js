import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'

import FuelCodeDetails from '../../../../src/admin/fuel_codes/components/FuelCodeDetails'
import store from '../../../../src/store/store'

test('FuelCodeDetails should display', () => {
  const item = {
    feedstockTransportMode: [],
    fuelTransportMode: []
  }

  const component = renderer.create(
    <BrowserRouter>
      <Provider store={store}>
        <FuelCodeDetails item={item} />
      </Provider>
    </BrowserRouter>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
