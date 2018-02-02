import React from 'react';
import PropTypes from 'prop-types';

import * as Routes from '../../constants/routes';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';
import history from '../../app/History';

const CreditTransferFormButtons = props => (
  <div className="btn-container">
    <button
      type="button"
      className="btn btn-default"
      onClick={() => history.push(Routes.CREDIT_TRANSACTIONS)}
    >
      Cancel
    </button>
    <button
      type="submit"
      className="btn btn-default"
      onClick={(event, status) => props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
    >
      Save Draft
    </button>
    <button
      type="submit"
      className="btn btn-primary"
      onClick={(event, status) => props.handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed)}
    >
      Propose
    </button>
  </div>
);

CreditTransferFormButtons.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default CreditTransferFormButtons;
