import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { FUEL_CODES } from '../../../constants/routes/Admin'
import Loading from '../../../app/components/Loading'
import * as Lang from '../../../constants/langEnUs'
import PERMISSIONS_FUEL_CODES from '../../../constants/permissions/FuelCodes'
import FuelCodesTable from './FuelCodesTable'

import { download } from '../../../utils/functions'
import * as Routes from '../../../constants/routes'
import { useNavigate } from 'react-router'

const FuelCodesPage = (props) => {
  const { isFetching, items } = props.fuelCodes
  const isEmpty = items.length === 0
  const navigate = useNavigate()

  return (
    <div className="page-fuel-codes">
      <h1>{props.title}</h1>
      <div className="right-toolbar-container">
        <div className="actions-container">
          {props.loggedInUser.hasPermission(PERMISSIONS_FUEL_CODES.MANAGE) &&
          <button
            id="new-submission"
            className="btn btn-primary"
            onClick={() => {
              const route = FUEL_CODES.ADD.replace(':type', '')
              navigate(route)
            }}
            type="button"
          >
            <FontAwesomeIcon icon="plus-circle" /> {Lang.BTN_NEW_FUEL_CODE}
          </button>
          }
          <button
            className="btn btn-info"
            id="download-fuel-codes"
            type="button"
            onClick={(e) => {
              const element = e.target
              const original = element.innerHTML

              element.firstChild.textContent = ' Downloading...'

              return download(Routes.BASE_URL + FUEL_CODES.EXPORT, {}).then(() => {
                element.innerHTML = original
              })
            }}
          >
            <FontAwesomeIcon icon="file-excel" /> <span>Download as .xls</span>
          </button>
        </div>
      </div>
      {isFetching && <Loading />}
      {!isFetching &&
      <FuelCodesTable
        handleTooltip={props.handleTooltip}
        isEmpty={isEmpty}
        isFetching={isFetching}
        items={items}
        loggedInUser={props.loggedInUser}
        tooltips={props.tooltips}
      />
      }
    </div>
  )
}

FuelCodesPage.defaultProps = {
}

FuelCodesPage.propTypes = {
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired,
  handleTooltip: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  title: PropTypes.string.isRequired,
  tooltips: PropTypes.shape({}).isRequired
}

export default FuelCodesPage
