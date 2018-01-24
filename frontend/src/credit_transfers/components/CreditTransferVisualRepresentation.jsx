import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

import * as Values from '../../constants/values';

const CreditTransferVisualRepresentation = props => (
  <div className="row visual-representation">
    <div className="col-sm-4 col-md-2 col-md-offset-1">
      <div className="initiator-container label-success">
        <div>{props.initiator && props.initiator != null ? props.initiator.name : Values.DEFAULT_INITIATOR}</div>
      </div>
    </div>
    <div className="col-sm-4 col-md-2">
      <div className="arrow">
        <div>{props.numberOfCredits} credit{props.numberOfCredits > 2 && 's'}</div>
        <i className="fa fa-exchange"></i>
        <div><FormattedNumber value={props.totalValue} style="currency" currency="CAD"/> </div>
      </div>
    </div>
    <div className="col-sm-4 col-md-3">
      <div className="respondent-container label-warning">
        <div>{props.respondent.name}</div>
        <div>Status: Sell Only</div>
      </div>
    </div>
  </div>
);

CreditTransferVisualRepresentation.defaultProps = {
  initiator: {
    name: 'Initiator'
  },
  respondent: {
    name: 'Respondent'
  },
  numberOfCredits: ''
};

CreditTransferVisualRepresentation.propTypes = {
  initiator: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  respondent: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }),
  numberOfCredits: PropTypes.string,
  totalValue: PropTypes.number.isRequired
};

export default CreditTransferVisualRepresentation;
