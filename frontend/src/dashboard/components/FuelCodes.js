import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../../app/components/Loading'
import { FUEL_CODES } from '../../constants/routes/Admin'
import { useNavigate } from 'react-router'

const FuelCodes = (props) => {
  const { isFetching, items } = props.fuelCodes
  const navigate = useNavigate()

  if (isFetching) {
    return <Loading />
  }

  const awaitingReview = {
    fuelCodes: {
      total: 0
    }
  }

  items.forEach((item) => {
    if (item.status.status === 'Draft') {
      awaitingReview.fuelCodes.total += 1
    }
  })

  return (
    <div className="dashboard-fieldset fuel-codes">
      <h1>Fuel Codes</h1>
      <p>There are:</p>

      <div>
        <div className='fuel-codes-value'>
          <div className="value">
            {awaitingReview.fuelCodes.total}
          </div>
        </div>
        <div className="content">
          <h2>Fuel codes in progress:</h2>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'status',
                  value: 'Draft'
                }], 'fuel-codes')

                return navigate(FUEL_CODES.LIST)
              }}
              type="button"
            >
              {awaitingReview.fuelCodes.total} awaiting Director review and statutory decision
            </button>
          </div>
        </div>
        <p><br /></p>
      </div>

      <div>
        <div className="content">
          <button
            onClick={() => {
              props.setFilter([{
                id: 'status',
                value: ''
              }], 'fuel-codes')

              return navigate(FUEL_CODES.LIST)
            }}
            type="button"
          >
            See all fuel codes
          </button>
        </div>
        <p><br /></p>
      </div>
    </div>
  )
}

FuelCodes.defaultProps = {
}

FuelCodes.propTypes = {
  fuelCodes: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
}

export default FuelCodes
