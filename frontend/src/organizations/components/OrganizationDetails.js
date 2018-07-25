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
        {props.organization.details.organizationAddress &&
          <div className="address">
            <dl className="dl-horizontal">
              <dt>Address:</dt>
              <dd>{props.organization.details.organizationAddress.addressLine_1}</dd>
              <dt />
              <dd>{props.organization.details.organizationAddress.addressLine_2}</dd>
              <dt />
              <dd>{props.organization.details.organizationAddress.addressLine_3}</dd>
              <dt />
              <dd>{`${props.organization.details.organizationAddress.city}, ${props.organization.details.organizationAddress.postalCode}, ${props.organization.details.organizationAddress.country}`}</dd>
            </dl>
          </div>
        }
        <div className="status">
          <dl className="dl-horizontal">
            <dt>Status:</dt>
            <dd>{props.organization.details.statusDisplay}</dd>
          </dl>
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
      organizationAddress: PropTypes.shape({
        addressLine_1: PropTypes.string,
        addressLine_2: PropTypes.string,
        addressLine_3: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
        state: PropTypes.string,
        country: PropTypes.string
      }),
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    }),
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

export default OrganizationDetails;
