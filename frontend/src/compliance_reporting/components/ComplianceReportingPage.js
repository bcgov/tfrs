import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import CONFIG from '../../config'
import * as Lang from '../../constants/langEnUs'
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport'
import ComplianceReportingTable from './ComplianceReportingTable'

const ComplianceReportingPage = (props) => {
  const { isFetching, items, itemsCount } = props.complianceReports
  const organizations = props.organizations
  const isEmpty = items.length === 0
  const filters = props.savedState['compliance-reporting']?.filtered
  const [selectedSupplierValue, setSelectedSupplierValue] = useState('')
  const [supplierOptions, setSupplierOptions] = useState([])
  const [showSupplierOption, setShowSupplierOption] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  
  let [filtersObj, setFiltersObj] = useState(filters || [])
  const [selectedFilters, setSelectedFilters] = useState({
    selectedStatus: [],
    selectedType: [],
  })
  const [statusTypes, setStatustypes] = useState([
    {
      name: 'In Draft',
      value: 'In Draft',
    },
    {
      name: 'Awaiting Government review',
      value: 'awaiting government review',
    },
    {
      name: 'Supplemntal Requested',
      value: 'supplemnetal requested',
    },
    
    {
      name: 'Accepted',
      value: 'Accepted',
    },
    {
      name: 'Rejected',
      value: 'Rejected',
    },
  ])
  const [statusTypeGov, setStatustypeGov] = useState([
    {
      name: 'For Analyst Review',
      value: 'For Analyst Review',
    },
    {
      name: 'For Manager Review',
      value: 'For Manager Review',
    },
    {
      name: 'For Director Review',
      value: 'For Director Review',
    },
    {
      name: 'Supplemental Requested',
      value: 'Supplemental Requested',
    },
    
    {
      name: 'Accepted',
      value: 'Accepted',
    },
    {
      name: 'Rejected',
      value: 'Rejected',
    },
  ])
  useEffect(() => {
    setSupplierOptions(organizations.items)
  }, [organizations.items])

  const handleFiltersChange = (name, value) => {
    let filterObj = JSON.parse(JSON.stringify(filtersObj))
    setShowSupplierOption(false)
    switch (name) {
      case 'clear': {
        setFiltersObj([])
        setSelectedFilters({
          selectedStatus: [],
          selectedType: [],
        })
        setSelectedYear('All')
        setSelectedSupplierValue('')
        return
      }
      case 'display-name': {
        const checkboxes = document.getElementsByName(name)
        let val = []
        checkboxes.forEach((cb) => {
          if (cb.checked) {
            val.push(cb.value)
          }
        })
        value = val
        const idx = filterObj.findIndex((val) => val.id === name)
        if (idx == -1) {
          filterObj = [...filterObj, { id: name, value }]
        } else {
          filterObj[idx] = { id: name, value }
        }
        setSelectedFilters({ ...selectedFilters, selectedType: value })
        if (!value.length) {
          filterObj.splice(idx, 1)
        }
        break
      }
      case 'current-status': {
        const idx = filterObj.findIndex((val) => val.id === name)
        if (idx == -1) {
          value = [value]
          filterObj = [...filterObj, { id: name, value }]
        } else {
          const isNew = filterObj[idx].value.includes(value)
          if (!isNew) {
            value = [...filterObj[idx].value, value]
          } else {
            const valIdx = filterObj[idx].value.findIndex(
              (val) => val === value
            )
            filterObj[idx].value.splice(valIdx, 1)
            value = filterObj[idx].value
          }
          filterObj[idx] = { id: name, value }
        }
        setSelectedFilters({ ...selectedFilters, selectedStatus: value })
        if (!value.length) {
          filterObj.splice(idx, 1)
        }
        break
      }
      default: {
        if (!value) return
        const idx = filterObj.findIndex((val) => val.id === name)
        if (idx == -1) {
          filterObj = [...filterObj, { id: name, value }]
        } else {
          filterObj[idx] = { id: name, value }
        }
        if (!value) {
          filterObj.splice(idx, 1)
        }
        setSelectedFilters({ ...selectedFilters, selectedYear: value })
        break
      }
    }
    setFiltersObj(filterObj)
  }
  const supplierFilterFunction = (e) => {
    const filterdOptions = organizations.items.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setSupplierOptions(filterdOptions)
  }
  const showSupplierOptions = () => {
    setShowSupplierOption(!showSupplierOption)
  }
  

  return (
    <div className='page-compliance-reporting'>
      <h1>{props.title}</h1>
      {props.loggedInUser.hasPermission(
        PERMISSIONS_COMPLIANCE_REPORT.MANAGE
      ) && (
        <div className='right-toolbar-container'>
          <div className='actions-container'>
            <div className='btn-group'>
              <button
                id='new-compliance-report'
                className='btn btn-primary'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
                type='button'
              >
                <FontAwesomeIcon icon='plus-circle' />{' '}
                {Lang.BTN_NEW_COMPLIANCE_REPORT}
              </button>
              <button
                type='button'
                className='btn btn-primary dropdown-toggle'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span className='caret' />
                <span className='sr-only'>Toggle Dropdown</span>
              </button>
              <ul className='dropdown-menu'>
                {props.compliancePeriods.map((compliancePeriod) => (
                  <li key={compliancePeriod.description}>
                    <button
                      onClick={() => {
                        const found = items.findIndex(
                          (item) =>
                            item.status.fuelSupplierStatus === 'Submitted' &&
                            item.compliancePeriod.id === compliancePeriod.id &&
                            item.type === 'Compliance Report'
                        )

                        if (found >= 0) {
                          props.selectComplianceReport(
                            'compliance',
                            compliancePeriod.description
                          )
                          props.showModal(true)
                        } else {
                          props.createComplianceReport(
                            compliancePeriod.description
                          )
                        }
                      }}
                      type='button'
                    >
                      {compliancePeriod.description}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {CONFIG.EXCLUSION_REPORTS.ENABLED && (
              <div className='btn-group'>
                <button
                  id='new-exclusion-report'
                  className='btn btn-primary'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                  type='button'
                >
                  <FontAwesomeIcon icon='plus-circle' />{' '}
                  {Lang.BTN_NEW_EXCLUSION_REPORT}
                </button>
                <button
                  type='button'
                  className='btn btn-primary dropdown-toggle'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                >
                  <span className='caret' />
                  <span className='sr-only'>Toggle Dropdown</span>
                </button>
                <ul className='dropdown-menu'>
                  {props.compliancePeriods.map((compliancePeriod) => (
                    <li key={compliancePeriod.description}>
                      <button
                        onClick={() => {
                          const found = items.findIndex(
                            (item) =>
                              item.status.fuelSupplierStatus === 'Submitted' &&
                              item.compliancePeriod.id ===
                                compliancePeriod.id &&
                              item.type === 'Exclusion Report'
                          )

                          if (found >= 0) {
                            props.selectComplianceReport(
                              'exclusion',
                              compliancePeriod.description
                            )
                            props.showModal(true)
                          } else {
                            props.createExclusionReport(
                              compliancePeriod.description
                            )
                          }
                        }}
                        type='button'
                      >
                        {compliancePeriod.description}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      <div className='compliance-filters-parent'>
        <div className='compliance-filters-rowOne'>
        <div className='compliance-selectedYear'>
          <p>Compliance Period</p>
          <select
            name='compliance-period'
            value={selectedYear} // Set selected year as default value
            onChange={(e) =>{
              setSelectedYear(parseInt(e.target.value))
              handleFiltersChange(e.target.name, e.target.value)
            }
          }
          > 
            <option value={0}>All</option> {/* Update the value to be an empty string */}
            {/* Render options for years from 2019 to current year */}
            {Array.from({length: new Date().getFullYear() - 2018}, (_, index) => {
              const year = 2019 + index
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            })}
          </select>
        </div>

          {!props.loggedInUser.hasPermission(
            PERMISSIONS_COMPLIANCE_REPORT.MANAGE
          ) && (
            <div className='compliance-inputSelect'>
              <p>Supplier</p>
              <div>
                <input
                  value={selectedSupplierValue}
                  type='text'
                  onChange={(e) => {
                    setSelectedSupplierValue(e.target.value)
                    supplierFilterFunction(e)
                  }}
                  placeholder='Select an option'
                  onClick={showSupplierOptions}
                />
                {showSupplierOption && !organizations.isFetching && (
                  <ul>
                    {supplierOptions.map(({ name, id }) => {
                      return (
                        <li
                          key={Math.random() + id}
                          onClick={() => {
                            setSelectedSupplierValue(name)
                            handleFiltersChange('supplier', id)
                          }}
                        >
                          {name}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
          <div className='compliance-checkboxSelect'>
            <p>Type</p>
            <input
              type='checkbox'
              value='Compliance Report'
              name='display-name'
              checked={selectedFilters.selectedType.includes(
                'Compliance Report'
              )}
              onChange={(e) =>
                handleFiltersChange(e.target.name, e.target.value)
              }
            />
            <p>Compliance Reports</p>
            <input
              type='checkbox'
              value='Exclusion Report'
              name='display-name'
              checked={selectedFilters.selectedType.includes(
                'Exclusion Report'
              )}
              onChange={(e) =>
                handleFiltersChange(e.target.name, e.target.value)
              }
            />
            <p>Exclusion Reports</p>
          </div>
          <div>
            <button
              onClick={() => handleFiltersChange('clear')}
              type='button'
              className='clearFilter'
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className='compliance-filters-rowTwo'>
          <span>Status </span>
          {!props.loggedInUser.isGovernmentUser ? statusTypes.map((type, idx) => {
            return (
              <span
                key={idx + Math.random()}
                className={`status ${
                  selectedFilters.selectedStatus.includes(type.value)
                    ? 'status-active'
                    : ''
                }`}
                onClick={() =>
                  handleFiltersChange('current-status', type.value)
                }
              >
                {type.name} {selectedFilters.selectedStatus.includes(type.value) ? <span> &#x2713;</span> : <span> &#x271B;</span> } 
              </span>
            )
          })
          : statusTypeGov.map((type, idx) => {
            return (
              <span
                key={idx + Math.random()}
                className={`status ${
                  selectedFilters.selectedStatus.includes(type.value)
                    ? 'status-active'
                    : ''
                }`}
                onClick={() =>
                  handleFiltersChange('current-status', type.value)
                }
              >
                {type.name} {selectedFilters.selectedStatus.includes(type.value) ? <span> &#x2713;</span> : <span> &#x271B;</span> } 
              </span>
            )
          })
        }
        </div>
      </div>
      <ComplianceReportingTable
        getComplianceReports={props.getComplianceReports}
        items={items}
        itemsCount={itemsCount}
        isFetching={isFetching || organizations.isFetching}
        isEmpty={isEmpty}
        loggedInUser={props.loggedInUser}
        filters={filtersObj}
      />
    </div>
  )
}

ComplianceReportingPage.defaultProps = {}

ComplianceReportingPage.propTypes = {
  createComplianceReport: PropTypes.func.isRequired,
  createExclusionReport: PropTypes.func.isRequired,
  compliancePeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  complianceReports: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape),
    itemsCount: PropTypes.number,
  }).isRequired,
  getComplianceReports: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func,
  }).isRequired,
  selectComplianceReport: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  savedState: PropTypes.shape().isRequired,
}

export default ComplianceReportingPage
