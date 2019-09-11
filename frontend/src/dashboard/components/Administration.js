import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import {
  CREDIT_TRANSACTIONS_HISTORY,
  HISTORICAL_DATA_ENTRY,
  USERS
} from '../../constants/routes/Admin';
import ORGANIZATIONS from '../../constants/routes/Organizations';

const Administration = props => (
  <div className="dashboard-fieldset">
    <h1>Administration</h1>

    <div>
      <div className="value">
        <FontAwesomeIcon icon="cog" />
      </div>

      <div className="content administration">
        <div>
          <Link id="navbar-administration" to={USERS.LIST}>
            Manage government users
          </Link>
        </div>

        <div>
          <Link
            id="collapse-navbar-organization"
            to={ORGANIZATIONS.LIST}
          >
            Add/Edit fuel suppliers
          </Link>
        </div>

        <div>
          <Link id="navbar-administration" to={CREDIT_TRANSACTIONS_HISTORY.LIST}>
            User Activity
          </Link>
        </div>

        <div>
          <Link to={HISTORICAL_DATA_ENTRY.LIST}>
            Historical Data Entry
          </Link>
        </div>
      </div>
    </div>
  </div>
);

Administration.defaultProps = {
};

Administration.propTypes = {
};

export default Administration;
