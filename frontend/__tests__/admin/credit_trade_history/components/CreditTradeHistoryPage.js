import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'

import CreditTradeHistoryPage from '../../../../src/admin/credit_trade_history/components/CreditTradeHistoryPage'
import store from '../../../../src/store/store'

test('CreditTradeHistoryPage should display', () => {
  const component = renderer.create(
    <BrowserRouter>
      <Provider store={store}>
        <CreditTradeHistoryPage />
      </Provider>
    </BrowserRouter>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
