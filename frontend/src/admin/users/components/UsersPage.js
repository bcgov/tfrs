/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import Loading from '../../../app/components/Loading';
import * as Lang from '../../../constants/langEnUs';
import OrganizationMembersTable from '../../../organizations/components/OrganizationMembersTable';
import history from '../../../app/History';
import PERMISSIONS_USERS from '../../../constants/permissions/Users';
import USERS from '../../../constants/routes/Users';
import { USERS as ADMIN_USERS } from '../../../constants/routes/Admin';

const UsersPage = (props) => {
  const { isFetching, users } = props.data;

  return (
    <div className="page_users">
      <h1>
        Users
      </h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.hasPermission(PERMISSIONS_USERS.USER_MANAGEMENT) &&
          <div className="btn-group">
            <button
              id="new-user"
              className="btn btn-primary"
              onClick={() => history.push(ADMIN_USERS.ADD)}
              type="button"
            >
              <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_USER}
            </button>
            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="caret" />
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  onClick={() => history.push(USERS.ADD)}
                  type="button"
                >
                  <FontAwesomeIcon icon="user" /> Add Fuel Supplier User
                </button>
              </li>
            </ul>
          </div>
          }
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
        <OrganizationMembersTable
          items={users}
          loggedInUser={props.loggedInUser}
        />
      }
    </div>
  );
};

UsersPage.propTypes = {
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  data: PropTypes.shape({
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
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

export default connect(mapStateToProps)(UsersPage);
