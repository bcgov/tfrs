import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

const data = [
  {
    creditTransferStatus: 'draft',
    actionBy: 'John Williams',
    organization: 'BC Any Fuels',
    date: '2017-09-04',
    organizationPartner: 'Ultramar',
    transactionType: 'offer to sell',
    tradeEffectiveDate: "Director's Approval",
    credits: 10000,
    pricePerCredit: 100,
    notes: 'Internal: For review',
  }
]
export default class TransactionHistory extends Component {
  render() {
    return (
      <div>
        <h2>Transaction History</h2>
        <BootstrapTable data={data}>
          <TableHeaderColumn dataField="creditTransferStatus" isKey={true} dataSort={true}>Credit Transfer Status</TableHeaderColumn>
          <TableHeaderColumn dataField="actionBy" dataSort={true}>Action By</TableHeaderColumn>
          <TableHeaderColumn dataField="organization" dataSort={true}>Organization</TableHeaderColumn>
          <TableHeaderColumn dataField="date" dataSort={true}>Date</TableHeaderColumn>
          <TableHeaderColumn dataField="organizationPartner">Organization Partner</TableHeaderColumn>
          <TableHeaderColumn dataField="transactionType" dataSort={true}>Transaction Type</TableHeaderColumn>
          <TableHeaderColumn dataField="tradeEffectiveDate" dataSort={true}>Trade Effective Date</TableHeaderColumn>
          <TableHeaderColumn dataField="credits" dataSort={true}>Credits</TableHeaderColumn>
          <TableHeaderColumn dataField="pricePerCredit" dataSort={true}>Price Per Credit</TableHeaderColumn>
          <TableHeaderColumn dataField="notes" dataSort={true}>Notes</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}