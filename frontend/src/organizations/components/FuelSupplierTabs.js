import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import ORGANIZATIONS from '../../constants/routes/Organizations';
import PERMISSIONS_ROLES from '../../constants/permissions/Roles';

const FuelSupplierTabs = props => (
  <ul className="fuel-supplier-tabs nav nav-tabs" key="nav" role="tablist">
    <li role="presentation" className={`${(props.active === 'users') ? 'active' : ''}`}>
      <Link id="navbar-administration" to={ORGANIZATIONS.MINE}>
        Users
      </Link>
    </li>
    {props.loggedInUser.hasPermission(PERMISSIONS_ROLES.ASSIGN_FS_ROLES) &&
      <li role="presentation" className={`${(props.active === 'roles') ? 'active' : ''}`}>
        <Link id="navbar-administration" to={ORGANIZATIONS.ROLES}>
          Roles
        </Link>
      </li>
    }
  </ul>
);

FuelSupplierTabs.propTypes = {
  active: PropTypes.string.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired
};

export default FuelSupplierTabs;
