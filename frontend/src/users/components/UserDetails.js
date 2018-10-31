/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';

import UserHistoryTable from './UserHistoryTable';

const UserDetails = props => (
  <div className="page_user">
    {props.user.isFetching && <Loading />}
    {!props.user.isFetching &&
      <div>
        <h1>
          {`${props.user.details.firstName} ${props.user.details.lastName}`}
        </h1>
        {props.user.details.organization &&
          <div>Company:
            <strong> {props.user.details.organization.name}</strong>
          </div>
        }
        <div>Email:
          <strong> {props.user.details.email}</strong>
        </div>
        <div>Work Phone:
          <strong> {props.user.details.phone || '-'}</strong>
        </div>
        <div>Mobile Phone:
          <strong> {props.user.details.cellPhone || '-'}</strong>
        </div>
        <div>Status:
          <strong> {props.user.details.isActive ? 'Active' : 'Inactive'}</strong>
        </div>
        {props.user.details.roles &&
          <div>Role:
            <strong> {props.user.details.roles.map(role => role.description).join(', ')}
            </strong>
          </div>
        }
        <div className="user_history">
          <h3>User Activity</h3>
          {props.user.details.history &&
            <UserHistoryTable items={props.user.details.history} />
          }
        </div>
      </div>
    }
  </div>
);

UserDetails.propTypes = {
  user: PropTypes.shape({
    details: PropTypes.shape({
      authorizationId: PropTypes.string,
      cellPhone: PropTypes.string,
      email: PropTypes.string,
      firstName: PropTypes.string,
      history: PropTypes.arrayOf(PropTypes.shape()),
      id: PropTypes.number,
      isActive: PropTypes.bool,
      lastName: PropTypes.string,
      organization: PropTypes.shape({
        name: PropTypes.string
      }),
      phone: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number
      }))
    }),
    errors: PropTypes.shape({}),
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

export default UserDetails;
