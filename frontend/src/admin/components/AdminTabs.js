import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { CREDIT_TRANSACTIONS_HISTORY, HISTORICAL_DATA_ENTRY, ROLES, USERS } from '../../constants/routes/Admin';

const AdminTabs = props => (
  <ul className="admin-tabs nav nav-tabs" key="nav" role="tablist">
    <li role="presentation" className={`${(props.active === 'historical-data') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={HISTORICAL_DATA_ENTRY.LIST}>
        Historical Data Entry
      </Link>
    </li>
    <li role="presentation" className={`${(props.active === 'user-activity') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={CREDIT_TRANSACTIONS_HISTORY.LIST}>
        User Activity
      </Link>
    </li>
    <li role="presentation" className={`${(props.active === 'users') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={USERS.LIST}>
        Users
      </Link>
    </li>
    <li role="presentation" className={`${(props.active === 'roles') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={ROLES.LIST}>
        Roles
      </Link>
    </li>
  </ul>
);

AdminTabs.propTypes = {
  active: PropTypes.string.isRequired
};

export default AdminTabs;
