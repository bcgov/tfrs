/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../../app/components/Loading';
import OrganizationMembersTable from '../../../organizations/components/OrganizationMembersTable';

const UsersPage = props => (
  <div className="page_organization">
    <div className="page_users">
      <h1>
        Users
      </h1>
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
