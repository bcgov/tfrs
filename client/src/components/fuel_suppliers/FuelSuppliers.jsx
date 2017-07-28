import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { getFuelSuppliers } from '../../actions/fuelSuppliersActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class FuelSuppliers extends Component {

  componentDidMount() {
    this.props.getFuelSuppliers();
  }

  actionsFormatter(cell, row) {
    return (
      <div>
        <Link to="/" className="counter-btn">Counter</Link>
      </div>
    )
  }

  handleCheckboxChange() {
  }

  createCustomButtonGroup(props) {
    return (
      <div>
        <h1 className='header'>Fuel Suppliers</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="btn btn-primary">Add</button>
            <label className="checkbox"> 
              <input type="checkbox" onChange={() => this.handleCheckboxChange()} />
              Active Only
            </label>
          </div>
          { props.components.searchPanel }
        </div>
      </div>
    );
  }
  
  render() {
    const options = {
      toolBar: this.createCustomButtonGroup.bind(this)
    };
    return (
      <div className="fuel-suppliers row">
        <div className="fuel-suppliers-table col-lg-12">
          <BootstrapTable 
            data={this.props.fuelSuppliersData}
              options={ options }
              search
            >
            <TableHeaderColumn className="name" dataField="name" isKey={true} dataSort={true}>Name</TableHeaderColumn>
            <TableHeaderColumn dataField="status" dataSort={true}>Status</TableHeaderColumn>
            <TableHeaderColumn dataField="actions_permitted" dataSort={true}>Status</TableHeaderColumn>
            <TableHeaderColumn dataField="credit_balance" dataSort={true}>Credit Balance</TableHeaderColumn>
            <TableHeaderColumn dataField="encumbered_credits" dataSort={true}>Encumbered Credits</TableHeaderColumn>
            <TableHeaderColumn dataField="last_transaction" dataSort={true}>Last Transaction</TableHeaderColumn>
            <TableHeaderColumn dataField="pending_actions" columnClassName="actions">Pending Actions</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <Modal
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="note-container">                
              <label>Note:</label>
              <textarea className="note" rows="4" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-default">Cancel</button>
            <button type="button" className="btn btn-primary">Accept</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default connect (
  state => ({
    fuelSuppliersData: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data,
  }),
  dispatch => ({
    getFuelSuppliers: () => {
      dispatch(getFuelSuppliers());
    },
  })
)(FuelSuppliers)

