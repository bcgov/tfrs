/*
 * Presentational component
 */
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';

import history from '../../../app/History';
import CREDIT_TRANSACTIONS from '../../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../../../constants/values';
import * as Routes from '../../../constants/routes';
import { CREDIT_TRANSACTIONS_HISTORY } from '../../../constants/routes/Admin';

class CreditTradeHistoryTable extends React.Component {
  constructor () {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true
    };
    this.fetch = this.fetch.bind(this);
  }

  fetch (state, instance) {
    this.setState({ loading: true });

    const offset = state.page * state.pageSize;
    const limit = state.pageSize;

    const sortBy = state.sorted[0].id;
    const sortDirection = state.sorted[0].desc ? '-' : '';

    new Promise((resolve, reject) =>
      axios.get(`${Routes.BASE_URL}${CREDIT_TRANSACTIONS_HISTORY.API}`, {
        params: {
          limit,
          offset,
          sort_by: sortBy,
          sort_direction: sortDirection
        }
      }).then(response =>
        resolve({
          rows: response.data,
          pages: Math.ceil(parseInt(response.headers['x-total-count'], 10) / state.pageSize)
        }))).then((data) => {
      this.setState({
        data: data.rows,
        pages: data.pages,
        loading: false
      });
    });
  }

  render () {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    });

    const columns = [{
      accessor: 'id',
      className: 'col-id',
      Header: 'ID',
      resizable: false,
      show: false
    }, {
      accessor: item => `${item.user.firstName} ${item.user.lastName}`,
      className: 'col-user',
      Header: 'User',
      id: 'user',
      minWidth: 50
    }, {
      accessor: item => (item.isRescinded
        ? CREDIT_TRANSFER_STATUS.rescinded.description
        : (
          Object.values(CREDIT_TRANSFER_STATUS).find(element => element.id === item.status.id)
        ).description),
      className: 'col-action',
      Header: 'Action Taken',
      id: 'action',
      minWidth: 50
    }, {
      accessor: item => item.creditTrade.id,
      className: 'col-id',
      Header: 'Transaction ID',
      id: 'creditTradeId',
      resizable: false,
      width: 100
    }, {
      accessor: item => item.creditTrade.initiator.name,
      className: 'col-initiator',
      Header: 'Initiator',
      id: 'initiator',
      minWidth: 100
    }, {
      accessor: item => item.creditTrade.respondent.name,
      className: 'col-respondent',
      Header: 'Respondent',
      id: 'respondent',
      minWidth: 100
    }, {
      accessor: (item) => {
        if (item.creditTradeUpdateTime) {
          const ts = Date.parse(item.creditTradeUpdateTime);

          return formatter.format(ts);
        }

        return '-';
      },
      className: 'col-timestamp',
      Header: 'Timestamp',
      id: 'updateTimestamp',
      minWidth: 75
    }, {
      accessor: item => item.creditTrade.id,
      Cell: (row) => {
        const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.value);

        return <Link to={viewUrl}><FontAwesomeIcon icon="box-open" /></Link>;
      },
      className: 'col-actions',
      filterable: false,
      Header: '',
      id: 'actions',
      width: 30
    }];

    const { data, pages, loading } = this.state;

    return (
      <ReactTable
        defaultPageSize={15}
        defaultSorted={[{
          id: 'updateTimestamp',
          desc: true
        }]}
        filterable={false}
        getTrProps={(state, row) => {
          if (row && row.original) {
            return {
              onClick: (e) => {
                const viewUrl = CREDIT_TRANSACTIONS.DETAILS.replace(':id', row.original.creditTrade.id);
                history.push(viewUrl);
              },
              className: 'clickable'
            };
          }

          return {};
        }}
        manual
        data={data}
        pages={pages}
        loading={loading}
        onFetchData={this.fetch}
        sortable
        multisort={false}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        columns={columns}
      />
    );
  }
}

export default CreditTradeHistoryTable;
