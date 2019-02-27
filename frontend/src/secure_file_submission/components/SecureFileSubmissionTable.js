/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

import history from '../../app/History';
import SECURE_DOCUMENT_UPLOAD from '../../constants/routes/SecureDocumentUpload';

const SecureFileSubmissionTable = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  }, {
    accessor: item => (item.createUser.organization ? item.createUser.organization.name : ''),
    className: 'col-organization',
    Header: 'Organization',
    id: 'organization',
    minWidth: 75,
    show: props.loggedInUser.isGovernmentUser
  }, {
    accessor: item => (item.type ? item.type.description : ''),
    className: 'col-attachment-type',
    Header: 'Attachment Type',
    id: 'attachment-type',
    minWidth: 75
  }, {
    accessor: (item) => {
      if (item.status) {
        if (item.status.status === 'Pending Submission') {
          const attachmentsScanned = item.attachments.filter(attachment => (
            ['PASS', 'FAIL'].indexOf(attachment.securityScanStatus) >= 0
          )).length;
          // ensure that we always have at least 1 so we don't divide by 0
          const totalAttachments = (item.attachments.length > 0
            ? item.attachments.length : 1);

          return `Scan Progress: ${((attachmentsScanned / totalAttachments) * 100).toFixed(0)}%`;
        }

        return item.status.status;
      }

      return false;
    },
    className: 'col-status',
    Header: 'Status',
    id: 'status',
    minWidth: 75
  }, {
    accessor: (item) => {
      if (item.type.theType === 'Evidence') {
        if (item.milestone &&
          item.milestone.milestone &&
          item.milestone.milestone.length > 0) {
          return `${item.title}: ${item.milestone.milestone}`;
        }
      }

      return item.title;
    },
    className: 'col-title',
    Header: 'Title',
    id: 'title',
    minWidth: 100
  }, {
    className: 'col-credit-transaction-id',
    Header: 'Credit Transaction ID',
    id: 'credit-transaction-id',
    minWidth: 70
  }, {
    accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
    className: 'col-date',
    Header: 'Last Updated On',
    id: 'updateTimestamp',
    minWidth: 65
  }, {
    accessor: 'id',
    Cell: (row) => {
      const viewUrl = SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', row.value);

      return <Link to={viewUrl}><FontAwesomeIcon icon="box-open" /></Link>;
    },
    className: 'col-actions',
    filterable: false,
    Header: '',
    id: 'actions',
    minWidth: 25
  }];

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };

  const filterable = true;

  return (
    <ReactTable
      className="searchable"
      columns={columns}
      data={props.items}
      defaultFilterMethod={filterMethod}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original) {
          return {
            onClick: (e) => {
              const viewUrl = SECURE_DOCUMENT_UPLOAD.DETAILS.replace(':id', row.original.id);

              history.push(viewUrl);
            },
            className: 'clickable'
          };
        }

        return {};
      }}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

SecureFileSubmissionTable.defaultProps = {};

SecureFileSubmissionTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    createUser: PropTypes.shape({
      organization: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    status: PropTypes.shape({
      status: PropTypes.string
    }),
    listTitle: PropTypes.string,
    type: PropTypes.shape({
      id: PropTypes.integer
    })
  })).isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default SecureFileSubmissionTable;
