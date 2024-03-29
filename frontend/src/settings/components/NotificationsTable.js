/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import 'react-table/react-table.css'

import CheckBox from '../../app/components/CheckBox'
import ReactTable from '../../app/components/StateSavingReactTable'

const NotificationsTable = (props) => {
  const columns = [{
    accessor: item => (item.description),
    className: 'col-action',
    Header: 'Action',
    headerClassName: 'col-action',
    id: 'action'
  }, {
    accessor: item => (item.code),
    Cell: row => (
      <CheckBox
        addToFields={props.addToFields}
        field="in_app"
        fields={props.fields}
        id={row.value}
        toggleCheck={props.toggleCheck}
        type={props.type}
        value
      />
    ),
    className: 'col-in-app',
    Header: 'Enabled',
    id: 'in-app',
    sortable: false
  }, {
    accessor: item => (item.code),
    Cell: row => (
      <CheckBox
        addToFields={props.addToFields}
        field="email"
        fields={props.fields}
        id={row.value}
        toggleCheck={props.toggleCheck}
        type={props.type}
        value
      />
    ),
    className: 'col-email',
    Header: 'Receive Email Notification',
    id: 'email',
    sortable: false
  }, {
    accessor: item => (item.code),
    Cell: row => (
      <CheckBox
        addToFields={props.addToFields}
        field="sms"
        fields={props.fields}
        id={row.value}
        toggleCheck={props.toggleCheck}
        type={props.type}
        value
      />
    ),
    className: 'col-sms',
    Header: 'Receive SMS Notification',
    id: 'sms',
    sortable: false,
    show: false
  }]

  return (
    <ReactTable
      stateKey="notifications-credit-transactions"
      data={props.items}
      defaultPageSize={props.items.length}
      columns={columns}
    />
  )
}

NotificationsTable.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleCheck: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default NotificationsTable
