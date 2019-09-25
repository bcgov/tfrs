import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import ORGANIZATIONS from '../../constants/routes/Organizations';

const CreditTradingValue = props => (
  <div className="dashboard-card">
    <a
      href={ORGANIZATIONS.CREDIT_MARKET_REPORT}
      rel="noopener noreferrer"
      target="_blank"
    >
      Credit Market Report
    </a>
    <a
      href={ORGANIZATIONS.CREDIT_MARKET_REPORT}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FontAwesomeIcon icon={['far', 'file-pdf']} />
    </a>
  </div>
);

CreditTradingValue.defaultProps = {
};

CreditTradingValue.propTypes = {
};

export default CreditTradingValue;
