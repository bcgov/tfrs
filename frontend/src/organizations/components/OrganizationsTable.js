/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import 'react-table/react-table.css'
import numeral from 'numeral'

import * as NumberFormat from '../../constants/numeralFormats'
import ORGANIZATIONS from '../../constants/routes/Organizations'
import ORGANIZATION_STATUSES from '../../constants/organizationStatuses'
import ReactTable from '../../app/components/StateSavingReactTable'
import CONFIG from '../../config'

const OrganizationsTable = (props) => {
  const { loggedInUser } = props
  const userType = loggedInUser.isGovernmentUser ? 'IDIR' : 'BCeID'
  const tearDownConfig = CONFIG.TEAR_DOWN[userType]

  const columns = []

  // Always include the Organization Name column
  columns.push({
    accessor: item => item.name,
    className: 'col-name',
    Header: 'Organization Name',
    id: 'name',
    minWidth: 200,
    Cell: (row) => {
      const viewUrl = ORGANIZATIONS.DETAILS.replace(':id', row.original.id)

      return <Link to={viewUrl}>{row.value}</Link>
    },
  })

  // Conditionally include "Compliance Units" column
  if (!tearDownConfig.ORGANIZATIONS.TABLE_COLUMNS.COMPLIANCE_UNITS) {
    columns.push({
      accessor: item => item.organizationBalance.validatedCredits,
      Cell: row => numeral(row.value).format(NumberFormat.INT),
      className: 'col-credit-balance',
      Header: 'Compliance Units',
      id: 'creditBalance',
      minWidth: 100
    })
  }

  // Conditionally include "In Reserve" column
  if (!tearDownConfig.ORGANIZATIONS.TABLE_COLUMNS.IN_RESERVE) {
    columns.push({
      accessor: item => item.organizationBalance.deductions,
      Cell: row => numeral(row.value).format(NumberFormat.INT),
      className: 'col-deductions',
      Header: 'In Reserve',
      id: 'inreserve',
      minWidth: 100,
    })
  }

  // Always include the Registered column
  columns.push({
    accessor: item => {
      const orgStatus = Object.values(ORGANIZATION_STATUSES)
        .find(element => element.id === item.status)
      if (orgStatus.description === 'Active') {
        return 'Yes'
      } else if (orgStatus.description === 'Inactive') {
        return 'No'
      }
      return orgStatus.description // default to the actual description if not Active/Inactive
    },
    className: 'col-status-display',
    Header: 'Registered',
    id: 'status',
    minWidth: 50,
    filterMethod: (filter, row) => {
      const filterValue = filter.value.toLowerCase()
      const cellValue = row[filter.id].toLowerCase()
      // Flexible conditions for "yes"
      if (cellValue === 'yes' && (filterValue === 'y' || filterValue === 'ye' || filterValue === 'yes')) {
        return true
      }
      // Flexible conditions for "no"
      if (cellValue === 'no' && (filterValue === 'n' || filterValue === 'no')) {
        return true
      }
      return false
    }
  })

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined
      ? String(row[id])
        .toLowerCase()
        .includes(filter.value.toLowerCase())
      : true
  }

  const filterable = true

  return (
    <ReactTable
      stateKey="organizations"
      className="searchable"
      data={props.items}
      defaultPageSize={10}
      defaultSorted={[{
          id: 'name',
        desc: false
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
      defaultFilterMethod={filterMethod}
      columns={columns}
    />
  )
}

OrganizationsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool.isRequired,
  }).isRequired,
}

export default OrganizationsTable
