import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../../app/components/Loading'
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import { useNavigate } from 'react-router'

const ComplianceReports = (props) => {
  const { isFinding, supplementalItems, isGettingDashboard } = props.complianceReports
  console.log(props.supplementalItems,'100')
  const navigate = useNavigate()

  if (isFinding || isGettingDashboard) {
    return <Loading />
  }

  const awaitingReview = {
    analyst: 0,
    director: 0,
    manager: 0,
    total: 0
  }

  supplementalItems && supplementalItems.forEach((item) => {
   let { status } = item
    if (status.fuelSupplierStatus === 'Submitted' && status.analystStatus === 'Unreviewed' 
        && status.directorStatus === 'Unreviewed'&& status.managerStatus === 'Unreviewed') {
            awaitingReview.analyst += 1
            awaitingReview.total += 1
    }

    if (['Not Recommended', 'Recommended'].indexOf(status.analystStatus) >= 0 &&
    status.managerStatus === 'Unreviewed' && status.directorStatus === 'Unreviewed'
    && status.fuelSupplierStatus == 'Submitted') {
        awaitingReview.manager += 1
        awaitingReview.total += 1
    }

    if (['Not Recommended', 'Recommended'].indexOf(status.managerStatus) >= 0 &&
    status.directorStatus === 'Unreviewed') {
        awaitingReview.director += 1
        awaitingReview.total += 1
    }
  })

  return (
    <div className="dashboard-fieldset">
      <h1>Compliance &  Exclusion Reports</h1>
      There are:

      <div>
        <div className="value">
          {awaitingReview.total}
        </div>
        <div className="content">
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'current-status',
                  value: ['For Analyst Review','For Manager Review','For Director Review']
                } 
              ], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST,{state:{items:["For Analyst Review","For Manager Review","For Director Review" ]}})
              }}
              type="button"
            >
             compliance / Exclusion report(s) in progress:
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="content">
          <h2>View all reports:</h2>

          <div>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear()

                props.setFilter([{
                  id: 'compliance-period',
                  value: currentYear.toString()
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              Current compliance period
            </button>
            {' | '}
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              All/historical
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ComplianceReports.defaultProps = {
}

ComplianceReports.propTypes = {
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    isFinding: PropTypes.bool,
    isGettingDashboard: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  setFilter: PropTypes.func.isRequired
}

export default ComplianceReports
