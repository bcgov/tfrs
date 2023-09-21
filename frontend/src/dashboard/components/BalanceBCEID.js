import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'


import Tooltip from '../../app/components/Tooltip'
import * as NumberFormat from '../../constants/numeralFormats'
import ORGANIZATIONS from '../../constants/routes/Organizations'

const BalanceBCEID = props => (
  <div className="dashboard-card balance">
    {props.loggedInUser.organization && props.loggedInUser.organization.organizationBalance && [
      <h2 key="name">{props.loggedInUser.organization.name}</h2>,
      <div key="label">has a total balance of</div>,
      <div className="value" key="value">
        {numeral(props.loggedInUser.organization.organizationBalance.validatedCredits).format(NumberFormat.INT)}
      </div>,
      <h2 key="validated-credits">validated credits</h2>,
      <div className="value smaller-text" key="deductions">
        ({numeral(props.loggedInUser.organization.organizationBalance.deductions).format(NumberFormat.INT)} in reserve)
        <Tooltip
          className="info"
          show
          title="Reserved credits are the portion of credits in your credit balance that are
          currently pending the completion of a credit transaction. For example, selling
          credits to another organization (i.e. Credit Transfer) or being used to offset
          outstanding debits in a compliance period. Reserved credits cannot be transferred
          or otherwise used until the pending credit transaction has been completed."
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
