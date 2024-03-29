/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as Lang from '../../../constants/langEnUs'
import { FUEL_CODES } from '../../../constants/routes/Admin'
import { useNavigate } from 'react-router'

const FuelCodeDetails = props => {
  const navigate = useNavigate()
  return (
    <div className="page-fuel-code-details">
      <div className="fuel-code-details">
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-code">Low Carbon Fuel Code:
                <div className="value">{props.item.fuelCode}{props.item.fuelCodeVersion}{props.item.fuelCodeVersionMinor ? `.${props.item.fuelCodeVersionMinor}` : '.0'}</div>
              </label>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-code">Company:
                <div className="value">{props.item.company}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="carbon-intensity">Carbon Intensity:
                <div className="value">{props.item.carbonIntensity}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="application-date">Application Date:
                <div className="value">{props.item.applicationDate}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="effective-date">Effective Date:
                <div className="value">{props.item.effectiveDate}</div>
              </label>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="expiry-date">Expiry Date:
                <div className="value">{props.item.expiryDate}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel">Fuel:
                <div className="value">{props.item.fuel}</div>
              </label>
            </div>
          </div>

          {props.item.renewablePercentage && props.item.renewablePercentage.length > 0 && [
            <div className="col-sm-6 col-lg-2" key="is-partially-renewable">
              <div className="form-group">
                <label htmlFor="fuel">Is Partially Renewable?
                  <div className="value">Yes</div>
                </label>
              </div>
            </div>,
            <div className="col-sm-6 col-lg-4" key="renewable-percentage">
              <div className="form-group">
                <label htmlFor="fuel">Percentage of Part 2 fuel that is renewable (%):
                  <div className="value">{props.item.renewablePercentage}%</div>
                </label>
              </div>
            </div>
          ]}
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="feedstock">Feedstock:
                <div className="value">{props.item.feedstock}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="feedstock-location">Feedstock Location:
                <div className="value">{props.item.feedstockLocation}</div>
              </label>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="feedstock-miscellaneous">Feedstock Miscellaneous:
                <div className="value">{props.item.feedstockMisc}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="facility-location">Fuel Production Facility Location (City, Province/State/Country):
                <div className="value">{props.item.facilityLocation}</div>
              </label>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="facility-nameplate">Fuel Production Facility Nameplate Capacity (litres/GJ per year):
                <div className="value">{props.item.facilityNameplate && props.item.facilityNameplate.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="feedstock-transport-mode">Feedstock Transport Mode
                <div className="value">{props.item.feedstockTransportMode && props.item.feedstockTransportMode.join(', ')}</div>
              </label>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="fuel-transport-mode">Finished Fuel Transport Mode
                <div className="value">{props.item.fuelTransportMode && props.item.fuelTransportMode.join(', ')}</div>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="former-company-name">Former Company Name:
              <div className="value">{props.item.formerCompany}</div>
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="approval-date">Approval Date:
              <div className="value">{props.item.approvalDate}</div>
            </label>
          </div>
        </div>
      </div>

      <div className="btn-container">
        <button
          className="btn btn-default"
          onClick={() => navigate(-1)}
          type="button"
        >
          <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
        </button>
        {props.item.status && props.item.status.status === 'Draft' &&
        <button
          className="btn btn-danger"
          data-target="#confirmDelete"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
        </button>
        }

        <button
          className="btn btn-default"
          type="button"
          onClick={() => navigate(FUEL_CODES.EDIT.replace(':id', props.item.id))}
        >
          <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT}
        </button>
      </div>
    </div>
  )
}

FuelCodeDetails.defaultProps = {}

FuelCodeDetails.propTypes = {
  item: PropTypes.shape({
    applicationDate: PropTypes.string,
    approvalDate: PropTypes.string,
    carbonIntensity: PropTypes.string,
    company: PropTypes.string,
    effectiveDate: PropTypes.string,
    expiryDate: PropTypes.string,
    facilityLocation: PropTypes.string,
    facilityNameplate: PropTypes.number,
    feedstock: PropTypes.string,
    feedstockLocation: PropTypes.string,
    feedstockMisc: PropTypes.string,
    feedstockTransportMode: PropTypes.arrayOf(PropTypes.string),
    formerCompany: PropTypes.string,
    fuel: PropTypes.string,
    fuelCode: PropTypes.string,
    fuelCodeVersion: PropTypes.number,
    fuelCodeVersionMinor: PropTypes.number,
    fuelTransportMode: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.number,
    renewablePercentage: PropTypes.string,
    status: PropTypes.shape({
      status: PropTypes.string
    })
  }).isRequired
}

export default FuelCodeDetails
