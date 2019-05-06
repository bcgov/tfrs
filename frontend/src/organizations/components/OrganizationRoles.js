/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../../app/components/Loading';
import FuelSupplierTabs from './FuelSupplierTabs';
import OrganizationRolesTable from './OrganizationRolesTable';

const OrganizationRoles = (props) => {
  const { isFinding, items } = props.data;

  return (
    <div className="organization-members">
      {props.loggedInUser &&
      !props.loggedInUser.isGovernmentUser &&
        <FuelSupplierTabs
          active="roles"
          loggedInUser={props.loggedInUser}
        />
      }
      <h2>Roles</h2>

      {isFinding && <Loading />}
      {!isFinding &&
        <OrganizationRolesTable
          items={items}
          loggedInUser={props.loggedInUser}
        />
      }
    </div>
  );
};

OrganizationRoles.defaultProps = {
  loggedInUser: null
};

OrganizationRoles.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFinding: PropTypes.bool.isRequired
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool
  })
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(OrganizationRoles);
