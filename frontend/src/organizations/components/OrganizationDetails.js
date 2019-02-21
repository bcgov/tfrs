/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import * as NumberFormat from '../../constants/numeralFormats';
import history from '../../app/History';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import PERMISSIONS_ORGANIZATIONS from '../../constants/permissions/Organizations';

const OrganizationDetails = props => (
  <div className="page_organization">
    <div>
      <div className="credit_balance">
        {props.organization.organizationBalance &&
        <h3>
          Credit Balance: {
            numeral(props.organization.organizationBalance.validatedCredits)
              .format(NumberFormat.INT)
          }
        </h3>
        }
      </div>
      <h1>
        {props.organization.name}
      </h1>
      <div className="actions-container">
        {props.loggedInUser &&
        props.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS) &&
        <button
          id="edit-organization"
          className="btn btn-info"
          type="button"
          onClick={() => history.push(ORGANIZATIONS.EDIT.replace(':id', props.organization.id))}
        >
          <FontAwesomeIcon icon="edit" /> Edit
        </button>
        }
      </div>
      {props.organization.organizationAddress &&
      <div className="address">
        <dl className="dl-horizontal">
          <dt>Address:</dt>
          <dd>{props.organization.organizationAddress.addressLine_1}</dd>
          <dt />
          <dd>{props.organization.organizationAddress.addressLine_2}</dd>
          <dt />
          <dd>{props.organization.organizationAddress.addressLine_3}</dd>
          <dt />
          <dd>{`${props.organization.organizationAddress.city}, ${props.organization.organizationAddress.postalCode}, ${props.organization.organizationAddress.country}`}</dd>
        </dl>
      </div>
      }
      <div className="status">
        <dl className="dl-horizontal">
          <dt>Status:</dt>
          <dd>{props.organization.statusDisplay}</dd>
        </dl>
      </div>
    </div>
  </div>
);

OrganizationDetails.defaultProps = {
  loggedInUser: null
};

OrganizationDetails.propTypes = {
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }),
  organization: PropTypes.shape({
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
  }).isRequired
};

export default OrganizationDetails;
