/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import React, { Component } from 'react';

import CreditTransferListContainer from '../credit_transfers/CreditTransferListContainer';

/*
  TODO:
  -- Add filter/search
  -- Add 'Past 12 months' checkbox
*/
class AccountActivityContainter extends Component {
  render () {
    return (
      <CreditTransferListContainer />
    );
  }
}

export default AccountActivityContainter;
