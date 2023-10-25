/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as NumberFormat from '../../constants/numeralFormats'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import PERMISSIONS_ORGANIZATIONS from '../../constants/permissions/Organizations'
import Tooltip from '../../app/components/Tooltip'
import { useNavigate } from 'react-router'
import AddressBuilder from '../../app/components/AddressBuilder'

const OrganizationDetails = props => {
  const navigate = useNavigate()
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    attorneyAddressOther,
    attorneyStreetAddress,
    attorneyCity,
    attorneyProvince,
    attorneyPostalCode,
    attorneyCountry
  } = (props.organization.organizationAddress ? props.organization.organizationAddress : {})

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
              }){' '}
              <Tooltip
                className="info"
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
          props.loggedInUser.isGovernmentUser &&
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
            <dt style={{ width: '300px' }}><strong>Head Office Address:</strong></dt>
            <dd>{AddressBuilder({
              address_line_1: addressLine1,
              address_line_2: addressLine2,
              city,
              state,
              postal_code: postalCode,
              country
            })}</dd>
          </dl>
        </div>
        }
        {props.organization.organizationAddress &&
        props.organization.organizationAddress.attorneyStreetAddress &&
        <div className="address">
          <dl className="dl-horizontal">
            <dt style={{ width: '300px' }}><strong>Corporation or BC Attorney address:</strong></dt>
            <dd>{AddressBuilder({
              address_line_1: attorneyStreetAddress,
              address_line_2: attorneyAddressOther,
              city: attorneyCity,
              state: attorneyProvince,
              postal_code: attorneyPostalCode,
              country: attorneyCountry
            })}</dd>
          </dl>
        </div>
        }
        <div className="address">
          <dl className="dl-horizontal">
            <dt style={{ width: '300px' }}>&nbsp;</dt>
            <dd>Email <a href="mailto:lcfs@gov.bc.ca?subject=TFRS Address Update">lcfs@gov.bc.ca</a> to update address information.</dd>
          </dl>
        </div>
        <div className="address">
          <dl className="dl-horizontal">
          {props.loggedInUser.isGovernmentUser && (
              <dt style={{ width: '300px' }}>
                <strong>Company Profile, EDRMS Record #:</strong>
              </dt>
            )}
            <dd>{props.organization.edrmsRecord ? props.organization.edrmsRecord : ''}</dd>
          </dl>
        </div>
        <div className="status">
          <dl className="dl-horizontal">
            <dt style={{ width: '300px' }}><strong>Status:</strong></dt>
            <dd><strong>{props.organization.statusDisplay} — </strong>
            {props.organization.statusDisplay === 'Inactive' &&
              <span className="status-description">
                An inactive organization is not actively supplying fuel in British Columbia
                and cannot purchase low carbon fuel credits.
              </span>
            }
            {props.organization.statusDisplay !== 'Inactive' &&
              <span className="status-description">
                An active organization is one that is actively &quot;supplying&quot; fuel in
                British Columbia as defined under the
                  {' Greenhouse Gas Reduction (Renewable and Low Carbon Fuel Requirements) Act '}.
              </span>
            }
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}

OrganizationDetails.defaultProps = {
  loggedInUser: null
}

OrganizationDetails.propTypes = {
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool
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
      country: PropTypes.string,
      attorneyAddressOther: PropTypes.string,
      attorneyCity: PropTypes.string,
      attorneyCountry: PropTypes.string,
      attorneyPostalCode: PropTypes.string,
      attorneyStreetAddress: PropTypes.string
    }),
    organizationBalance: PropTypes.shape({
      deductions: PropTypes.number,
      validatedCredits: PropTypes.number
    }),
    statusDisplay: PropTypes.string
  }).isRequired
}

export default OrganizationDetails
