import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom'

import CreditTradeHistoryTable from '../../../../src/admin/credit_trade_history/components/CreditTradeHistoryTable';
import store from '../../../../src/store/store';

test('CreditTradeHistoryTable should display', () => {
  const component = renderer.create(
    <BrowserRouter>
      <Provider store={store}>
        <CreditTradeHistoryTable />
      </Provider>
    </BrowserRouter>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
