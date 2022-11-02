/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import * as NumberFormat from '../../constants/numeralFormats';
import ORGANIZATIONS from '../../constants/routes/Organizations';
import PERMISSIONS_ORGANIZATIONS from '../../constants/permissions/Organizations';
import Tooltip from '../../app/components/Tooltip';
import { useNavigate } from 'react-router';

const OrganizationDetails = props => {
  const navigate = useNavigate()
  return (
    <div className="page_organization">
      <div>
        <div className="credit_balance">
          {props.organization.organizationBalance &&
          <h3>
            Credit Balance: {
              numeral(props.organization.organizationBalance.validatedCredits)
                .format(NumberFormat.INT)
            }
            <div className="reserved">
              (In Reserve: {numeral(props.organization.organizationBalance.deductions)
                .format(NumberFormat.INT)
              }){` `}
              <Tooltip
                className="info"
                show
                title="Reserved credits are the portion of credits in your credit balance that are
                currently pending the completion of a credit transaction. For example, selling
                credits to another organization (i.e. Credit Transfer) or being used to offset
                outstanding debits in a compliance period. Reserved credits cannot be transferred
                or otherwise used until the pending credit transaction has been completed."
              >
                <FontAwesomeIcon icon="info-circle" />
              </Tooltip>
            </div>
          </h3>
          }
        </div>
        <h1>
          {props.organization.name}
        </h1>
        <div className="actions-container">
          {props.loggedInUser &&
          (props.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIERS) ||
            props.loggedInUser.hasPermission(PERMISSIONS_ORGANIZATIONS.EDIT_FUEL_SUPPLIER)
          ) &&
          <button
            id="edit-organization"
            className="btn btn-info"
            type="button"
            onClick={() => navigate(ORGANIZATIONS.EDIT.replace(':id', props.organization.id))}
          >
            <FontAwesomeIcon icon="edit" /> Edit
          </button>
          }
        </div>
        {props.organization.organizationAddress &&
        <div className="address">
          <dl className="dl-horizontal">
            <dt>Address:</dt>
            <dd>{props.organization.organizationAddress.addressLine1}</dd>
            <dt />
            <dd>{props.organization.organizationAddress.addressLine2}</dd>
            <dt />
            <dd>{props.organization.organizationAddress.addressLine3}</dd>
            <dt />
            <dd>{props.organization.organizationAddress.city && `${props.organization.organizationAddress.city}, `}
              {props.organization.organizationAddress.postalCode && `${props.organization.organizationAddress.postalCode}, `}
              {props.organization.organizationAddress.country}
            </dd>
          </dl>
        </div>
        }
        <div className="status">
          <dl className="dl-horizontal">
            <dt>Status:</dt>
            <dd>{props.organization.statusDisplay}</dd>
            <dt />
            {props.organization.statusDisplay === 'Inactive' &&
              <dd className="status-description">
                An inactive organization is not actively supplying fuel in British Columbia
                and cannot purchase low carbon fuel credits.
              </dd>
            }
            {props.organization.statusDisplay !== 'Inactive' &&
              <dd className="status-description">
                An active organization is one that is actively &quot;supplying&quot; fuel in
                British Columbia as defined under the
                <strong>
                  {` Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act `}
                </strong>.
              </dd>
            }
          </dl>
        </div>
      </div>
    </div>
  )
};

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
      addressLine1: PropTypes.string,
      addressLine2: PropTypes.string,
      addressLine3: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string
    }),
    organizationBalance: PropTypes.shape({
      deductions: PropTypes.number,
      validatedCredits: PropTypes.number
    }),
    statusDisplay: PropTypes.string
  }).isRequired
};

export default OrganizationDetails;
