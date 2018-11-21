import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { CREDIT_TRANSACTIONS_HISTORY, FUEL_CODES, HISTORICAL_DATA_ENTRY, ROLES, USERS } from '../../constants/routes/Admin';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import PERMISSIONS_ROLES from '../../constants/permissions/Roles';
import PERMISSIONS_USERS from '../../constants/permissions/Users';

const AdminTabs = props => (
  <ul className="admin-tabs nav nav-tabs" key="nav" role="tablist">
    {props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.USE_HISTORICAL_DATA_ENTRY) &&
    <li role="presentation" className={`${(props.active === 'historical-data') ? 'active' : ''}`}>
      <Link to={HISTORICAL_DATA_ENTRY.LIST}>
        Historical Data Entry
      </Link>
    </li>
    }
    {props.loggedInUser.hasPermission(PERMISSIONS_USERS.USER_MANAGEMENT) &&
      [
        <li
          role="presentation"
          key="user-activity"
          className={`${(props.active === 'user-activity') ? 'active' : ''}`}
        >
          <Link to={CREDIT_TRANSACTIONS_HISTORY.LIST}>
            User Activity
          </Link>
        </li>,
        <li
          role="presentation"
          className={`${(props.active === 'users') ? 'active' : ''}`}
          key="user-list"
        >
          <Link to={USERS.LIST}>
            Users
          </Link>
        </li>
      ]
    }
    {props.loggedInUser.hasPermission(PERMISSIONS_ROLES.ASSIGN_GOVERNMENT_ROLES) &&
      <li role="presentation" className={`${(props.active === 'roles') ? 'active' : ''}`}>
        <Link to={ROLES.LIST}>
          Roles
        </Link>
      </li>
    }
    <li role="presentation" className={`${(props.active === 'fuel-codes') ? 'active' : ''}`}>
      <Link to={FUEL_CODES.LIST}>
        Fuel Codes
      </Link>
    </li>
  </ul>
);

AdminTabs.propTypes = {
  active: PropTypes.string.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired
};

export default AdminTabs;
