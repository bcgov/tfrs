import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';

const BalanceBCEID = props => (
  <div className="dashboard-card">
    {props.loggedInUser.organization && props.loggedInUser.organization.organizationBalance && [
      <h2 key="name">{props.loggedInUser.organization.name}</h2>,
      <div key="label">has a balance of</div>,
      <div className="value" key="value">
        {numeral(props.loggedInUser.organization.organizationBalance.validatedCredits).format(NumberFormat.INT)}
      </div>,
      <h2 key="validated-credits">validated credits</h2>
    ]}
  </div>
);

BalanceBCEID.defaultProps = {
};

BalanceBCEID.propTypes = {
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      })
    })
  }).isRequired
};

export default BalanceBCEID;
