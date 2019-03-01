import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as Lang from '../../constants/langEnUs';
import SecureFileSubmissionCommentForm from './SecureFileSubmissionCommentForm';
import ReactTable from "react-table";
import moment from "moment";
import {Link} from "react-router-dom";
import {CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES} from "../../constants/values";
import {getCreditTransferType} from "../../actions/creditTransfersActions";
import numeral from "numeral";
import * as NumberFormat from "../../constants/numeralFormats";
import filterNumber from "../../utils/filters";

const LinkedCreditTransferSelection = (props) => {
  const columns = [{
    accessor: 'id',
    className: 'col-id',
    Header: 'ID',
    resizable: false,
    width: 45
  },
    {
      accessor: item => (item.compliancePeriod ? item.compliancePeriod.description : ''),
      className: 'col-compliance-period',
      Header: 'Compliance Period',
      id: 'compliancePeriod',
      minWidth: 45
    }, {
      accessor: item => getCreditTransferType(item.type.id),
      className: 'col-transfer-type',
      Header: 'Type',
      id: 'transactionType',
      minWidth: 110
    }, {
      accessor: item => ([
        CREDIT_TRANSFER_TYPES.part3Award.id, CREDIT_TRANSFER_TYPES.validation.id
      ].includes(item.type.id) ? '' : item.creditsFrom.name),
      Cell: (row) => {
        if (row.original.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
          row.original.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
          return (
            <div className="greyed-out">N/A</div>
          );
        }

        return row.value;
      },
      Header: 'Credits From',
      id: 'creditsFrom',
      minWidth: 190
    }, {
      accessor: item => ((item.type.id === CREDIT_TRANSFER_TYPES.retirement.id) ? '' : item.creditsTo.name),
      Cell: (row) => {
        if (row.original.type.id === CREDIT_TRANSFER_TYPES.retirement.id) {
          return (
            <div className="greyed-out">N/A</div>
          );
        }

        return row.value;
      },
      Header: 'Credits To',
      id: 'creditsTo',
      minWidth: 190
    }, {
      accessor: item => item.numberOfCredits,
      className: 'col-credits',
      Cell: row => numeral(row.value).format(NumberFormat.INT),
      filterMethod: (filter, row) => filterNumber(filter.value, row.numberOfCredits, 0),
      Header: 'Quantity of Credits',
      id: 'numberOfCredits',
      minWidth: 75
    }, {
      accessor: (item) => {
        if (item.type.id === CREDIT_TRANSFER_TYPES.part3Award.id ||
          item.type.id === CREDIT_TRANSFER_TYPES.retirement.id ||
          item.type.id === CREDIT_TRANSFER_TYPES.validation.id) {
          return -1; // this is to fix sorting (value can't be negative)
        }

        return parseFloat(item.fairMarketValuePerCredit);
      },
      Cell: row => (
        (row.value === -1) ? '-' : numeral(row.value).format(NumberFormat.CURRENCY)
      ),
      className: 'col-price',
      filterMethod: (filter, row) => filterNumber(filter.value, row.fairMarketValuePerCredit),
      Header: 'Value Per Credit',
      id: 'fairMarketValuePerCredit',
      minWidth: 65
    },
    {
      accessor: item => (item.isRescinded
        ? CREDIT_TRANSFER_STATUS.rescinded.description
        : (
          Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
        ).description),
      className: 'col-status',
      Header: 'Status',
      id: 'status',
      minWidth: 80
    }, {
      accessor: item => (item.updateTimestamp ? moment(item.updateTimestamp).format('YYYY-MM-DD') : '-'),
      className: 'col-date',
      Header: 'Last Updated On',
      id: 'updateTimestamp',
      minWidth: 95
    },
    {
      accessor: 'id',
      Cell: (row) => {
        return (
       <button
          id="credit-transfer-link"
          className="btn btn-primary"
          onClick={() => props.establishLink(row.value)}
          type="button"
        >
         <FontAwesomeIcon icon="link"/>
        </button>);
      },
      className: 'col-actions',
      filterable: false,
      Header: 'Link',
      id: 'actions',
      minWidth: 100
    }];

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };

  const filterable = true;


  return (<div>
    <h3>Linking Credit Transfer</h3>

    <ReactTable
      className="searchable"
      columns={columns}
      data={props.creditTransfers}
      defaultFilterMethod={filterMethod}
      defaultPageSize={10}
      defaultSorted={[{
        id: 'id',
        desc: true
      }]}
      filterable={filterable}
      pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
    />

    <button
      id="add-credit-transfer-link"
      className="btn btn-danger"
      onClick={() => props.cancelLink()}
      type="button"
    >
      {Lang.BTN_CANCEL_LINK_CREDIT_TRANSACTION}
    </button>
  </div>);
};

LinkedCreditTransferSelection.defaultProps = {
};

LinkedCreditTransferSelection.propTypes = {
  cancelLink: PropTypes.func.isRequired,
  establishLink: PropTypes.func.isRequired,
  creditTransfers: PropTypes.arrayOf(PropTypes.shape)

};

export default LinkedCreditTransferSelection;
