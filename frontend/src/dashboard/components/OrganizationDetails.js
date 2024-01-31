import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from 'react-router-dom'

import PERMISSIONS_ORGANIZATIONS from '../../constants/permissions/Organizations'
import PERMISSIONS_USERS from '../../constants/permissions/Users'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import USERS from '../../constants/routes/Users'

const OrganizationDetails = props => {
  const navigate = useNavigate()
  return (
    <div className="dashboard-fieldset organization-details">
      <h1>Organization Details</h1>

      <div>
        {props.loggedInUser.organization.name}
        {props.loggedInUser.organization.organizationAddress &&
        <dl>
          <dd>{props.loggedInUser.organization.organizationAddress.addressLine1}</dd>
          <dt />
          <dd>{props.loggedInUser.organization.organizationAddress.addressLine2}</dd>
          <dt />
          <dd>{props.loggedInUser.organization.organizationAddress.addressLine3}</dd>
          <dt />
          <dd>{props.loggedInUser.organization.organizationAddress.city && `${props.loggedInUser.organization.organizationAddress.city}, `}
            {props.loggedInUser.organization.organizationAddress.postalCode && `${props.loggedInUser.organization.organizationAddress.postalCode}`}
          </dd>
        </dl>
        }
      </div>
      <div className="organization-details-content">
          <div className="cog-icon ">
            <FontAwesomeIcon icon="cog" />
          </div>

      {props.loggedInUser &&
      props.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIER) &&
      props.isGovernmentUser &&
        <>
        <div className="content">
          <button
            type="button"
            onClick={() => navigate(ORGANIZATIONS.EDIT.replace(':id', props.loggedInUser.organization.id))}
          >
            Edit Address
          </button>
        </div>
        <p><br /></p>
        </>
      }

        <div className="content">
          <Link id="navbar-administration" to={ORGANIZATIONS.ROLES}>
            Roles
          </Link>
        </div>
        <p><br /></p>

        <div className="content">
          <Link id="navbar-administration" to={ORGANIZATIONS.MINE}>
            Users
          </Link>
        </div>
        <p><br /></p>

      {props.loggedInUser &&
      props.loggedInUser.hasPermission(PERMISSIONS_USERS.USER_MANAGEMENT) &&
        <>
          <div className="content">
            <Link to={USERS.ADD}>New user</Link>
          </div>
          <p><br /></p>
        </>
      }

        <div className="content">
          <a
            href="https://www.bceid.ca/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Create new BCeID account
          </a>
        </div>
        <p><br /></p>
      </div>
    </div>
  )
}

OrganizationDetails.defaultProps = {
}

OrganizationDetails.propTypes = {
  isGovernmentUser: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      organizationAddress: PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        addressLine3: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
        state: PropTypes.string
      })
    })
  }).isRequired
}

export default OrganizationDetails
