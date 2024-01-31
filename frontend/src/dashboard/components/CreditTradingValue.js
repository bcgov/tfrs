import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ORGANIZATIONS from '../../constants/routes/Organizations'

const CreditTradingValue = props => (
  <div className="dashboard-card">
    <h2>Low Carbon Fuel Standard</h2>
    <span>Visit our website at:</span>
    <div>
      <a
        href="https://gov.bc.ca/lowcarbonfuels"
        rel="noopener noreferrer"
        target="_blank"
      >
        https://gov.bc.ca/lowcarbonfuels
      </a>
    </div>
  </div>
)



CreditTradingValue.defaultProps = {
}

CreditTradingValue.propTypes = {
}

export default CreditTradingValue
