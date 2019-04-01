import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import CreditTradeHistoryPage from '../../../../src/admin/credit_trade_history/components/CreditTradeHistoryPage';
import store from '../../../../src/store/store';

test('CreditTradeHistoryPage should display', () => {
  const component = renderer.create(
    <Provider store={store}>
      <CreditTradeHistoryPage />
    </Provider>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
