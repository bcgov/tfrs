/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import PermissionsTable from './PermissionsTable';
import Loading from '../../app/components/Loading';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';

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
        <div className="btn-container">
          <button
            className="btn btn-default"
            onClick={() => history.goBack()}
            type="button"
          >
            <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
          </button>
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
