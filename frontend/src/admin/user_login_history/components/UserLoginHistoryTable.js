import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from '../../../app/components/StateSavingReactTable'

const UserLoginHistoryTable = (props) => {
  const columns = [{
    Header: 'ID',
    accessor: 'id'
  }, {
    Header: 'Keycloak Email',
    accessor: 'keycloak_email'
  }, {
    Header: 'External Username',
    accessor: 'external_username'
  }, {
    Header: 'Keycloak User ID',
    accessor: 'keycloak_user_id'
  }, {
    Header: 'Login Successful',
    accessor: 'is_login_successful',
    Cell: ({ value }) => (value ? 'Yes' : 'No')
  }, {
    Header: 'Login Error Message',
    accessor: 'login_error_message'
  }, {
    Header: 'Created Timestamp',
    accessor: 'created_timestamp'
  }]

  return (
    <ReactTable
      data={props.items}
      columns={columns}
      defaultPageSize={10}
      className="-striped -highlight"
      noDataText="No records found"
    />
  )
}

UserLoginHistoryTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    keycloak_email: PropTypes.string,
    external_username: PropTypes.string,
    keycloak_user_id: PropTypes.string,
    is_login_successful: PropTypes.bool,
    login_error_message: PropTypes.string,
    created_timestamp: PropTypes.string
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired
}

export default UserLoginHistoryTable
