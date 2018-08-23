/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import CheckBox from '../../app/components/CheckBox';

const NotificationsCreditTransactionsTable = (props) => {
  const columns = [{
    accessor: item => (item.description),
    className: 'col-action',
    Header: 'Action',
    headerClassName: 'col-action',
    id: 'action'
  }, {
    Cell: row => (
      <CheckBox
        addToFields={(field) => { }}
        fields={[]}
        id={1}
        toggleCheck={() => {}}
      />
    ),
    className: 'col-email',
    Header: 'Receive Email Notification',
    id: 'email',
    sortable: false
  }, {
    Cell: row => (
      <CheckBox
        addToFields={(field) => { }}
        fields={[]}
        id={1}
        toggleCheck={() => {}}
      />
    ),
    className: 'col-sms',
    Header: 'Receive SMS Notification',
    id: 'sms',
    sortable: false
  }, {
    Cell: row => (
      <CheckBox
        addToFields={(field) => { }}
        fields={[]}
        id={1}
        toggleCheck={() => {}}
      />
    ),
    className: 'col-sms',
    Header: 'Receive In-App Notification',
    id: 'sms',
    sortable: false
  }];

  return (
    <ReactTable
      data={props.items}
      defaultPageSize={props.items.length}
      columns={columns}
    />
  );
};

NotificationsCreditTransactionsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default NotificationsCreditTransactionsTable;
