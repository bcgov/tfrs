import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import {
  CREDIT_TRANSACTIONS_HISTORY,
  HISTORICAL_DATA_ENTRY,
  USERS
} from '../../constants/routes/Admin'
import ORGANIZATIONS from '../../constants/routes/Organizations'

const Administration = props => (
  <div className="dashboard-fieldset administration administration-reports">
    <h1>Administration</h1>
    <div className='administration-content'>
      <span className="icon">
        <FontAwesomeIcon icon="cog" />
      </span>

      <div>
        <div className="content">
          <Link id="navbar-administration" to={USERS.LIST}>
            Manage government users
          </Link>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <Link
            id="collapse-navbar-organization"
            to={ORGANIZATIONS.LIST}
          >
            Add/Edit fuel suppliers
          </Link>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <Link id="navbar-administration" to={CREDIT_TRANSACTIONS_HISTORY.LIST}>
            User Activity
          </Link>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <Link to={HISTORICAL_DATA_ENTRY.LIST}>
            Historical Data Entry
          </Link>
        </div>
        <p><br /></p>
      </div>
    </div>
  </div>
)

Administration.defaultProps = {
}

Administration.propTypes = {
}

export default Administration
