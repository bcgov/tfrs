/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loading from '../../app/components/Loading';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import PERMISSIONS_USERS from '../../constants/permissions/Users';
import USERS from '../../constants/routes/Users';
import FuelSupplierTabs from './FuelSupplierTabs';
import OrganizationMembersTable from './OrganizationMembersTable';

const OrganizationMembers = (props) => {
  const { isFetching, users } = props.members;

  return (
    <div className="organization-members">
      {props.loggedInUser &&
      !props.loggedInUser.isGovernmentUser &&
        <FuelSupplierTabs
          active="users"
          loggedInUser={props.loggedInUser}
        />
      }
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser &&
          props.loggedInUser.hasPermission(PERMISSIONS_USERS.USER_MANAGEMENT) &&
            <button
              id="new-user"
              className="btn btn-primary"
              onClick={() => history.push(USERS.ADD)}
              type="button"
            >
              <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_USER}
            </button>
          }
        </div>
      </div>
      <h2>Users</h2>
      {isFetching && <Loading />}
      {!isFetching && props.members &&
        <OrganizationMembersTable
          items={users}
          loggedInUser={props.loggedInUser}
        />
      }
    </div>
  );
};

OrganizationMembers.defaultProps = {
  loggedInUser: null
};

OrganizationMembers.propTypes = {
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool
  }),
  members: PropTypes.shape({
    isFetching: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      isActive: PropTypes.bool,
      lastName: PropTypes.string,
      role: PropTypes.shape({
        id: PropTypes.number
      })
    }))
  }).isRequired
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(OrganizationMembers);
