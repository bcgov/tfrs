/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import 'react-table/react-table.css'

import { ROLES } from '../../constants/routes/Admin'
import ReactTable from '../../app/components/StateSavingReactTable'

const OrganizationRolesTable = (props) => {
  const navigate = useNavigate()
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
      data={props.items}
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default OrganizationRolesTable
