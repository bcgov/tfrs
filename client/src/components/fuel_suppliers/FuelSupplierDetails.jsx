import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFuelSupplier } from '../../actions/fuelSuppliersActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class FuelSupplierDetails extends Component {
  
  componentDidMount() {
    this.props.getFuelSupplier(this.props.match.params.id);
  }

  documentsActionsFormatter(cell, row) {
    return (
      <div>
        <button className="btn btn-default">Download</button>
        <button className="btn btn-default">Delete</button>
      </div>
    )
  }

  documentsSearchPanel(props) {
    return (
      <div>
        <h1 className='header'>Correspondence</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="btn btn-primary">Add</button>
            <label className="checkbox"> 
              <input type="checkbox" />
              All Years
            </label>
          </div>
          { props.components.searchPanel }
        </div>
      </div>
    );
  }

  historySearchPanel(props) {
    return (
      <div>
        <h1 className='header'>History</h1>
        <div className='right-toolbar-container'> 
          { props.components.searchPanel }
        </div>
      </div>
    );
  }
  
  render() {
    const options = {
      toolBar: this.documentsSearchPanel.bind(this)
    };
    const historyTableOptions = {
      toolBar: this.historySearchPanel.bind(this)
    };
    return (
      <div className="row fuel-supplier-details">
        <h1 className="col-lg-12">{this.props.fuelSupplierData.name}</h1>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div className="fuel-supplier-info">
              <h2>Fuel Supplier Information</h2>
              <div>
                <span className="info-label">Name:</span><span className="info">{this.props.fuelSupplierData.name}</span>
              </div>
              <div>
                <span className="info-label">Corporate Address:</span><span className="info">{this.props.fuelSupplierData.address}</span>          
              </div>
              <div className="account-balance-container">
                <h2>Account Balance</h2>
                <div>
                  <div className="list-group">
                    <span className="list-group-item">
                      <span className="pull-right">50</span>
                      Available Balance of Validated Credits
                    </span>
                    <span className="list-group-item">
                      <span className="pull-right">55</span>
                      Validated Credits
                    </span>
                    <span className="list-group-item">
                      <span className="pull-right">5</span>
                      Encumbered by Proposed Transfer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contacts col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <BootstrapTable data={this.props.fuelSupplierData.contacts}>
              <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Contact</TableHeaderColumn>
              <TableHeaderColumn dataField="phone" dataSort={true}>Phone Number</TableHeaderColumn>
              <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
              <TableHeaderColumn dataField="role" columnClassName="actions">Role</TableHeaderColumn>
            </BootstrapTable>
          </div>
      </div>
      <div className="row">
        <div className="correspondence-table col-lg-12">
          <BootstrapTable 
            data={this.props.fuelSupplierData.documents}
            options={ options }
            search
          >
            <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Document Name</TableHeaderColumn>
            <TableHeaderColumn dataField="notes" dataSort={true}>Notes</TableHeaderColumn>
            <TableHeaderColumn dataField="year" dataSort={true}>Compliance Year</TableHeaderColumn>
            <TableHeaderColumn dataField="tags">Tags</TableHeaderColumn>
            <TableHeaderColumn dataField="date_uploaded">Date Uploaded</TableHeaderColumn>
            <TableHeaderColumn dataField="by">By</TableHeaderColumn>
            <TableHeaderColumn dataField="of">Of</TableHeaderColumn>
            <TableHeaderColumn columnClassName="actions" dataFormat={(cell, row) => this.documentsActionsFormatter(cell, row)}>Actions</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
      <div className="row">
        <div className="history-table col-lg-12">
          <BootstrapTable 
            data={this.props.fuelSupplierData.history}
            options={ historyTableOptions }
            search
          >
            <TableHeaderColumn dataField="date" isKey={true} dataSort={true}>Date/Time</TableHeaderColumn>
            <TableHeaderColumn dataField="by">By</TableHeaderColumn>
            <TableHeaderColumn dataField="of">Of</TableHeaderColumn>
            <TableHeaderColumn dataField="description">Description</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    </div>
    );
  }
}

export default connect (
  state => ({
    fuelSupplierData: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIER].data,
  }),
  dispatch => ({
    getFuelSupplier: (id) => {
      dispatch(getFuelSupplier(id));
    }
  })
)(FuelSupplierDetails)
