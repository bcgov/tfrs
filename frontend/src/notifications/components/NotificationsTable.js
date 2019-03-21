/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

import CheckBox from '../../app/components/CheckBox';
import history from '../../app/History';
import NOTIFICATION_TYPES from '../../constants/notificationTypes';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';
import StateSavingReactTable from "../../app/components/StateSavingReactTable";

const NotificationsTable = (props) => {
  const columns = [{
    accessor: item => item.id,
    Cell: row => (
      <CheckBox
        addToFields={props.addToFields}
        fields={props.fields.notifications}
        id={row.value}
        toggleCheck={props.toggleCheck}
      />
    ),
    className: 'col-mark',
    filterable: false,
    Header: 'Mark',
    id: 'mark',
    width: 50
  }, {
    accessor: (item) => {
      if (item.relatedCreditTrade) {
        return NOTIFICATION_TYPES[item.message].replace(/PVR/, item.relatedCreditTrade.type.theType);
      }

      return NOTIFICATION_TYPES[item.message];
    },
    Cell: (row) => {
      let viewUrl = null;

      if (row.original.relatedDocument) {
        viewUrl = SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', row.original.relatedDocument.id);
      } else if (row.original.relatedCreditTrade) {
        viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.original.relatedCreditTrade.id);
      }

      return (
        <button
          type="button"
          onClick={() => {
            props.updateNotification(row.original.id, { isRead: true });

            if (viewUrl) {
              history.push(viewUrl);
            }
          }}
        >
          {row.value}
        </button>
      );
    },
    className: 'col-notification',
    Header: 'Notification',
    headerClassName: 'col-notification',
    id: 'notification'
  }, {
    accessor: item => (item.createTimestamp ? moment(item.createTimestamp).format('YYYY-MM-DD h:mm a') : '-'),
    className: 'col-date',
    Header: 'Date',
    headerClassName: 'col-date',
    id: 'date',
    sortMethod: (a, b, desc) => {
      const value = moment(a).format('YYYY-MM-DD-HH:mm:ss');
      const previous = moment(b).format('YYYY-MM-DD-HH:mm:ss');

      // Return either 1 or -1 to indicate a sort priority
      if (value > previous) {
        return 1;
      }
      if (value < previous) {
        return -1;
      }
      // returning 0, undefined or any falsey value will use subsequent sorts or
      // the index as a tiebreaker
      return 0;
    },
    width: 150
  }, {
    accessor: item => (item.originatingUser ? `${item.originatingUser.firstName} ${item.originatingUser.lastName}` : '-'),
    className: 'col-user',
    Header: 'User',
    headerClassName: 'col-user',
    id: 'user',
    width: 150
  }, {
    accessor: item => (item.relatedCreditTrade ? item.relatedCreditTrade.id : '-'),
    Cell: (row) => {
      const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

      if (row.value === '-') {
        return '-';
      }

      return (
        <button
          type="button"
          onClick={() => {
            props.updateNotification(row.original.id, { isRead: true });

            history.push(viewUrl);
          }}
        >
          {row.value}
        </button>
      );
    },
    className: 'col-credit-trade',
    Header: 'Transaction ID',
    headerClassName: 'col-credit-trade',
    id: 'creditTrade',
    width: 100
  }, {
    accessor: item => (item.relatedOrganization ? item.relatedOrganization.name : '-'),
    className: 'col-organization',
    Header: 'Organization',
    headerClassName: 'col-organization',
    id: 'organization',
    width: 200
  }, {
    accessor: 'id',
    Cell: row => (
      <div className="col-actions">
        <button
          onClick={() => props.selectIdForModal(row.value)}
          type="button"
        >
          <FontAwesomeIcon
            data-toggle="modal"
            data-target="#confirmArchiveSingle"
            icon="archive"
          />
        </button>
      </div>
    ),
    filterable: false,
    Header: '',
    id: 'actions',
    width: 50
  }];

  const filterable = true;

  return (
    <StateSavingReactTable
      stateKey="notifications"
      className="searchable"
      columns={columns}
      data={props.items}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'date',
        desc: true
      }]}
      loading={props.isFetching}
      filterable={filterable}
      getTrProps={(state, rowInfo) => ({
        className: (rowInfo && rowInfo.original.isRead) ? 'read' : 'unread'
      })}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

NotificationsTable.propTypes = {
  addToFields: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    notifications: PropTypes.array
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired,
  selectIdForModal: PropTypes.func.isRequired,
  toggleCheck: PropTypes.func.isRequired,
  updateNotification: PropTypes.func.isRequired
};

export default NotificationsTable;
