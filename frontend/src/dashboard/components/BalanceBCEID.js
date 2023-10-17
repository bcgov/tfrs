import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Tooltip from '../../app/components/Tooltip'
import * as NumberFormat from '../../constants/numeralFormats'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import TOOLTIPS from '../../constants/tooltips'

const BalanceBCEID = props => (
  <div className="dashboard-card balance">
    {props.loggedInUser.organization && props.loggedInUser.organization.organizationBalance && [
      <h2 key="name">{props.loggedInUser.organization.name}</h2>,
      <div key="label">has a balance of</div>,
      <div className="value" key="value">
        {numeral(props.loggedInUser.organization.organizationBalance.validatedCredits).format(NumberFormat.INT)}
      </div>,
      <h2 key="validated-credits">compliance units</h2>,
      <div className="value smaller-text" key="deductions">
        ({numeral(props.loggedInUser.organization.organizationBalance.deductions).format(NumberFormat.INT)} in reserve)
        <Tooltip
          className="info"
          show
          title={TOOLTIPS.IN_RESERVE}
        >
          <FontAwesomeIcon icon="info-circle" />
        </Tooltip>
      </div>
    ]}
  </div>
)

BalanceBCEID.defaultProps = {
}

BalanceBCEID.propTypes = {
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        deductions: PropTypes.number,
        validatedCredits: PropTypes.number
      })
    })
  }).isRequired
}

export default BalanceBCEID
