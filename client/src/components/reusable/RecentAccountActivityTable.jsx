import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class RecentAccountActivityTable extends Component {

  handleAcceptClick(id) {
  }

  actionsFormatter(e) {
    return (
      <div>
        <button className="accept-btn" onClick={(id) => this.handleAcceptClick(e)}>Accept</button>
        <Link to="/" className="counter-btn">Counter</Link>
      </div>
    )
  }
  
  render() {
    return (
      <div className="account-activity-table">
        <BootstrapTable data={this.props.accountActivityData}>
          <TableHeaderColumn className="proposalDescription" dataField="proposalDescription" isKey={true} dataSort={true} columnClassName="proposal-description">Proposal Description</TableHeaderColumn>
          <TableHeaderColumn dataField="lastUpdated" dataSort={true}>Last Updated</TableHeaderColumn>
          <TableHeaderColumn dataField="status" dataSort={true}>Status</TableHeaderColumn>
          <TableHeaderColumn dataField="id" dataFormat={(e) => this.actionsFormatter(e)} columnClassName="actions">Actions</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default RecentAccountActivityTable;