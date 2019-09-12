import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import * as NumberFormat from '../../constants/numeralFormats';
import { DEFAULT_ORGANIZATION } from '../../constants/values';

const Balance = props => (
  <div className="dashboard-card">
    {!props.organization && [
      <h2 key="name">All Organizations</h2>,
      <h1 key="label">credit balance</h1>,
      <div className="value" key="value">
        {
          numeral(1000000000000000 -
            props.loggedInUser.organization.organizationBalance.validatedCredits)
            .format(NumberFormat.INT)
        }
      </div>
    ]}
    {props.organization && props.organization.organizationBalance && [
      <h2 key="name">{props.organization.name}</h2>,
      <h1 key="label">credit balance</h1>,
      <div className="value" key="value">
        {numeral(props.organization.organizationBalance.validatedCredits).format(NumberFormat.INT)}
      </div>
    ]}

    <div>Show transactions involving:</div>

    <select
      id="organizationFilterSelect"
      className="form-control"
      onChange={(event) => {
        const organizationId = parseInt(event.target.value, 10);
        props.selectOrganization(organizationId);
      }}
      value={props.organization.id}
    >
      <option value="-1">All Organizations</option>
      {props.organizations.map(organization =>
        (organization.id !== DEFAULT_ORGANIZATION.id &&
          <option
            key={organization.id.toString(10)}
            value={organization.id.toString(10)}
          >
            {organization.name}
          </option>
        ))}
    </select>
  </div>
);

Balance.defaultProps = {
  organization: {},
  organizations: []
};

Balance.propTypes = {
  loggedInUser: PropTypes.shape({
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      })
    })
  }).isRequired,
  organization: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        validatedCredits: PropTypes.number
      })
    })
  ]),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  selectOrganization: PropTypes.func.isRequired
};

export default Balance;
