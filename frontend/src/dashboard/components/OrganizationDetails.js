import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import history from '../../app/History';
import { USERS } from '../../constants/routes/Admin';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import PERMISSIONS_USERS from '../../constants/permissions/Users';

const OrganizationDetails = props => (
  <div className="dashboard-fieldset organization-details">
    <h1>Organization Details</h1>
    <span className="icon">
      <FontAwesomeIcon icon="cog" />
    </span>

    <div>
      {props.loggedInUser.organization.name}
      {props.loggedInUser.organization.organizationAddress &&
      <dl>
        <dd>{props.loggedInUser.organization.organizationAddress.addressLine_1}</dd>
        <dt />
        <dd>{props.loggedInUser.organization.organizationAddress.addressLine_2}</dd>
        <dt />
        <dd>{props.loggedInUser.organization.organizationAddress.addressLine_3}</dd>
        <dt />
        <dd>{props.loggedInUser.organization.organizationAddress.city && `${props.loggedInUser.organization.organizationAddress.city}, `}
          {props.loggedInUser.organization.organizationAddress.postalCode && `${props.loggedInUser.organization.organizationAddress.postalCode}`}
        </dd>
      </dl>
      }
    </div>

    <div>
      <div className="content">
        <button
          type="button"
          onClick={() => history.push(ORGANIZATIONS.EDIT.replace(':id', props.loggedInUser.organization.id))}
        >
          Edit Address
        </button>
      </div>
    </div>

    <div>
      <div className="content">
        <Link id="navbar-administration" to={ORGANIZATIONS.ROLES}>
          Roles
        </Link>
      </div>
    </div>

    <div>
      <div className="content">
        <Link id="navbar-administration" to={ORGANIZATIONS.MINE}>
          Users
        </Link>
      </div>
    </div>

    {props.loggedInUser &&
    props.loggedInUser.hasPermission(PERMISSIONS_USERS.USER_MANAGEMENT) &&
      <div>
        <div className="content">
          <Link to={USERS.ADD}>New user</Link>
        </div>
      </div>
    }

    <div>
      <div className="content">
        <a
          href="https://www.bceid.ca/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Create new BCeID account
        </a>
      </div>
    </div>
  </div>
);

OrganizationDetails.defaultProps = {
};

OrganizationDetails.propTypes = {
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationAddress: PropTypes.shape({
        addressLine_1: PropTypes.string,
        addressLine_2: PropTypes.string,
        addressLine_3: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
        state: PropTypes.string
      })
    })
  }).isRequired
};

export default OrganizationDetails;
