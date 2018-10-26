/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';
import PermissionsTable from './PermissionsTable';

const RoleDetails = props => (
  <div className="page_role">
    {props.role.isFetching && <Loading />}
    {!props.role.isFetching &&
      <div>
        <h1>
          {`${props.role.details.description}`}
        </h1>
        <div className="user_history">
          <h3>Permissions</h3>
          {props.role.details.permissions &&
          <PermissionsTable
            items={props.role.details.permissions}
          />
          }
        </div>
      </div>
    }
  </div>
);

RoleDetails.propTypes = {
  role: PropTypes.shape({
    details: PropTypes.shape({
      description: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.shape())
    }),
    errors: PropTypes.shape({}),
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

export default RoleDetails;
