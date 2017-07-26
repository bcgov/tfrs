import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var products = [{
      id: 1,
      name: "Item name 1",
      price: {
        price: 100,
        id: 1,
      }
  },{
      id: 2,
      name: "Item name 2",
      price: {
        price: 100,
        id: 2,
      }
  }];

class AccountActivityTable extends Component {

  handleAcceptClick(id) {
  }

  handleCounterClick(id) {
  }

  actionsFormatter(e) {
    return (
      <div>
        <button className="btn accept-btn" onClick={(id) => this.handleAcceptClick(e.id)}>Accept</button>
        <button className="btn counter-btn" onClick={(id) => this.handleCounterClick(e.id)}>Counter</button>
      </div>
    )
  }
  
  render() {
    return (
      <BootstrapTable data={products} search>
        <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Proposal Description</TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort={true}>Last Updated</TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort={true}>Status</TableHeaderColumn>
        <TableHeaderColumn dataField="price" dataFormat={(e) => this.actionsFormatter(e)}>Actions</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default AccountActivityTable;