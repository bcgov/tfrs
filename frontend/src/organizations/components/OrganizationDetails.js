/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Loading from '../../app/components/Loading';
import * as NumberFormat from '../../constants/numeralFormats';
import OrganizationMembersTable from './OrganizationMembersTable';

const OrganizationDetails = props => (
  <div className="page_organization">
    {props.organization.isFetching && <Loading />}
    {!props.organization.isFetching &&
      <div>
        <div className="credit_balance">
          {props.organization.details.organizationBalance &&
            <h3>
              Credit Balance: {
                numeral(props.organization.details.organizationBalance.validatedCredits)
                  .format(NumberFormat.INT)
              }
            </h3>
          }
        </div>
        <h1>
          {props.organization.details.name}
        </h1>
        <div className="status">
          Status: {props.organization.details.statusDisplay}
        </div>
        <h2>Users</h2>
        {props.members.isFetching && <Loading />}
        {!props.members.isFetching && props.members &&
          <OrganizationMembersTable items={props.members.users} />
        }
      </div>
    }
  </div>
);

OrganizationDetails.propTypes = {
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
  }).isRequired,
  organization: PropTypes.shape({
    details: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    }),
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

export default OrganizationDetails;
