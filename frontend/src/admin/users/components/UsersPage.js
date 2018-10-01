/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loading from '../../../app/components/Loading';
import * as Lang from '../../../constants/langEnUs';
import OrganizationMembersTable from '../../../organizations/components/OrganizationMembersTable';
import history from '../../../app/History';
import { USERS as ADMIN_USERS } from '../../../constants/routes/Admin';

const UsersPage = props => (
  <div className="page_organization">
    <div className="page_users">
      <h1>
        Users
      </h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          <button
            id="new-user"
            className="btn btn-primary"
            onClick={() => history.push(ADMIN_USERS.ADD)}
            type="button"
          >
            <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_USER}
          </button>
        </div>
      </div>
      {props.members.isFetching && <Loading />}
      {!props.members.isFetching && props.members &&
        <OrganizationMembersTable items={props.members.users} />
      }
    </div>
  </div>
);

UsersPage.propTypes = {
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

export default UsersPage;
