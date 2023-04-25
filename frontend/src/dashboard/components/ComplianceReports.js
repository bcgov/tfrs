import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../../app/components/Loading'
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting'
import { useNavigate } from 'react-router'

const ComplianceReports = (props) => {
  const { isFinding, items, isGettingDashboard } = props.complianceReports
  const navigate = useNavigate()
  const complianceManagerIds = []
  const exclusionManagerIds = []
  const placeholder = []

  if (isFinding || isGettingDashboard) {
    return <Loading />
  }

  const awaitingReview = {
    analyst: 0,
    director: 0,
    manager: 0,
    total: 0
    // complianceReports: {
    //   analyst: 0,
    //   director: 0,
    //   manager: 0,
    //   total: 0
    // },
    // exclusionReports: {
    //   analyst: 0,
    //   director: 0,
    //   manager: 0,
    //   total: 0
    // }
  }

  items.forEach((item) => {
    const { id } = item
    let id2 = id
    let { status } = item
    const { supplementalReports } = item

    if (supplementalReports.length > 0) {
      let [deepestSupplementalReport] = supplementalReports

      while (deepestSupplementalReport.supplementalReports &&
        deepestSupplementalReport.supplementalReports.length > 0) {
        [deepestSupplementalReport] = deepestSupplementalReport.supplementalReports
      }
      ({ status, id: id2 } = deepestSupplementalReport)
    }
    if (placeholder.includes(id2)) {
        return
      } else {
        placeholder.push(id2)
      }
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
          {/* <h2>compliance / Exclusion report(s) in progress:---</h2> */}

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
          {/* <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'managerIds',
                  value: {
                    ids: complianceManagerIds
                  }
                },
                {
                  tableId: [{
                    id: 'displayname',
                    value: 'Compliance Report'
                  }, {
                    id: 'current-status',
                    value: 'Analyst'
                  }]
                }
                ], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.complianceReports.manager} awaiting compliance manager review
            </button>
          </div> */}
          {/* <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Compliance Report'
                }, {
                  id: 'current-status',
                  value: 'Manager'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.complianceReports.director} awaiting Director review
            </button>
          </div> */}
        </div>
      </div>

      {/* <div>
        <div className="value">
          {awaitingReview.exclusionReports.total}
        </div>
        <div className="content">
          <h2>exclusion reports in progress:</h2>

          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Submitted'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.analyst} awaiting government analyst review
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                },
                {
                  id: 'managerIds',
                  value: {
                    ids: exclusionManagerIds
                  }
                }, {
                  tableId: [{
                    id: 'displayname',
                    value: 'Exclusion Report'
                  }, {
                    id: 'current-status',
                    value: 'Analyst'
                  }]
                }
                ], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.manager} awaiting compliance manager review
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                props.setFilter([{
                  id: 'compliance-period',
                  value: ''
                }, {
                  id: 'displayname',
                  value: 'Exclusion Report'
                }, {
                  id: 'current-status',
                  value: 'Manager'
                }], 'compliance-reporting')

                return navigate(COMPLIANCE_REPORTING.LIST)
              }}
              type="button"
            >
              {awaitingReview.exclusionReports.director} awaiting Director review
            </button>
          </div>
        </div>
      </div> */}

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
