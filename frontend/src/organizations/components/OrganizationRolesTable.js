/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import 'react-table/react-table.css'

import { ROLES } from '../../constants/routes/Admin'
import ReactTable from '../../app/components/StateSavingReactTable'
import CONFIG from '../../config'

const OrganizationRolesTable = (props) => {
  const navigate = useNavigate()
  const { items, loggedInUser } = props

  // Only apply tear down for BCeID users
  let filteredItems = items

  if (!loggedInUser.isGovernmentUser) {
    const tearDownConfig = CONFIG.TEAR_DOWN.BCeID

    const rolesToTearDown = []
    if (tearDownConfig.ORGANIZATION.ROLES.FILE_SUBMISSION) {
      rolesToTearDown.push(10) // Role ID for File Submission
    }
    if (tearDownConfig.ORGANIZATION.ROLES.CREDIT_TRANSFERS) {
      rolesToTearDown.push(4) // Role ID for Credit Transfers
    }

    // Filter out the roles that need to be torn down based on their IDs
    filteredItems = items.filter((item) => !rolesToTearDown.includes(item.id))
  }

  const columns = [{
      accessor: 'id',
      className: 'col-id',
      Header: 'ID',
      maxWidth: 50,
      resizable: false
    }, {
      accessor: item => (item.description),
      Header: 'Role',
      id: 'role'
    }]

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
      stateKey="organizations-roles"
      className="searchable"
      data={filteredItems}
      defaultFilterMethod={filterMethod}
      defaultSorted={[{
        id: 'role'
      }]}
      defaultPageSize={10}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = ROLES.DETAILS.replace(':id', row.original.id)
              navigate(viewUrl)
            },
            className: 'clickable'
          }
        }

        return {}
      }}
      columns={columns}
    />
  )
}

OrganizationRolesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool.isRequired,
  }).isRequired,
}

export default OrganizationRolesTable
