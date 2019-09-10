import React from 'react';

import ORGANIZATIONS from '../../constants/routes/Organizations';

const CreditTradingValue = props => (
  <div className="dashboard-card">
    <div className="value">$193.44</div>
    <h1>Credit trading value</h1>
    12 month average

    <a
      href={ORGANIZATIONS.CREDIT_MARKET_REPORT}
      rel="noopener noreferrer"
      target="_blank"
    >
      Credit Market Report
    </a>
  </div>
);

CreditTradingValue.defaultProps = {
};

CreditTradingValue.propTypes = {
};

export default CreditTradingValue;
