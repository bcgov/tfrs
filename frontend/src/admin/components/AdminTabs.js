import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

import {
  CREDIT_TRANSACTIONS_HISTORY, FUEL_CODES,
  HISTORICAL_DATA_ENTRY, ROLES, USERS, USER_LOGIN_HISTORY
} from '../../constants/routes/Admin'
import CREDIT_CALCULATIONS from '../../constants/routes/CreditCalculations'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import CONFIG from '../../config'

const AdminTabs = props => (
  <ul className="admin-tabs nav nav-tabs" key="nav" role="tablist">
    {props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.USE_HISTORICAL_DATA_ENTRY) &&
    <li role="presentation" className={`${(props.active === 'historical-data') ? 'active' : ''}`}>
      <Link to={HISTORICAL_DATA_ENTRY.LIST}>
        Historical Data Entry
      </Link>
    </li>
    }
    {props.loggedInUser.isGovernmentUser && [
      <li
        role="presentation"
        key="user-activity"
        className={`${(props.active === 'user-activity') ? 'active' : ''}`}
      >
        <Link id="navbar-administration" to={CREDIT_TRANSACTIONS_HISTORY.LIST}>
          User Activity
        </Link>
      </li>,
      <li
        role="presentation"
        className={`${(props.active === 'users') ? 'active' : ''}`}
        key="user-list"
      >
        <Link id="navbar-administration" to={USERS.LIST}>
          Users
        </Link>
      </li>,
      <li
        role="presentation"
        className={`${(props.active === 'roles') ? 'active' : ''}`}
        key="roles"
      >
        <Link id="navbar-administration" to={ROLES.LIST}>
          Roles
        </Link>
      </li>,
      <li
        role="presentation"
        className={`${(props.active === 'user-login-history') ? 'active' : ''}`}
        key="user-login-history"
      >
        <Link id="navbar-administration" to={USER_LOGIN_HISTORY.LIST}>
          User Login History
        </Link>
      </li>
    ]}
    {CONFIG.FUEL_CODES.ENABLED &&
    props.loggedInUser.isGovernmentUser &&
      <li
        role="presentation"
        className={`${(props.active === 'fuel-codes') ? 'active' : ''}`}
      >
        <Link to={FUEL_CODES.LIST}>
          Fuel Codes
        </Link>
      </li>
    }
    {CONFIG.COMPLIANCE_REPORTING.ENABLED &&
      <li
        role="presentation"
        className={`${(props.active === 'compliance-reporting') ? 'active' : ''}`}
      >
        <Link to={CREDIT_CALCULATIONS.LIST}>
          Compliance Reporting
        </Link>
      </li>
    }
  </ul>
)

AdminTabs.propTypes = {
  active: PropTypes.string.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool
  }).isRequired
}

export default AdminTabs
