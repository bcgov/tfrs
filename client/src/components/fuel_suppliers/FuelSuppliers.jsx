import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { getFuelSuppliers, searchFuelSuppliers, searchFuelSuppliersReset } from '../../actions/fuelSuppliersActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class FuelSuppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newFuelSupplierName: '',
      newFuelSupplierCity: '',
      showModal: false,
    };
  }

  componentDidMount() {
    this.props.getFuelSuppliers();
  }

  handleCheckboxChange() {
  }

  handleCloseModal() {
    this.setState({showModal: false});
    this.props.searchFuelSuppliersReset();
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.searchFuelSuppliers(this.state.newFuelSupplierName, this.state.newFuelSupplierCity);
  }

  createCustomButtonGroup(props) {
    return (
      <div>
        <h1 className='header'>Fuel Suppliers</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="btn btn-primary" onClick={() => this.setState({ showModal: true})}>Add</button>
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
          show={this.state.showModal}
          onHide={() => this.handleCloseModal()}
          aria-labelledby="contained-modal-title"
          className="new-fuel-supplier-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">New Fuel Supplier</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => this.handleSearch(e)}>
              <div className="field-container">
                <label htmlFor="name-field">Name:</label>
                <div className="input-container">
                  <input id="name-field" type="text" onChange={(e) => this.setState({newFuelSupplierName: e.target.value})} />
                </div>
              </div>
              <div className="field-container">
                <label htmlFor="city-field">City:</label>
                <div className="input-container">
                  <input id="city-field" type="text" placeholder="optional" onChange={(e) => this.setState({newFuelSupplierCity: e.target.value})} />
                </div>
              </div>
              <div className="btn-container">
                <input className="btn btn-default" type="button" onClick={() => this.handleCloseModal()} value="Cancel" />
                <input type="submit" className="btn btn-primary" value="search" />
              </div>
            </form>
            { this.props.searchFuelSuppliersSuccess &&
              <BootstrapTable 
                data={this.props.searchFuelSuppliersData}
              >
                <TableHeaderColumn className="name" dataField="name" isKey={true} dataSort={true}>Organization</TableHeaderColumn>
                <TableHeaderColumn dataField="status" dataSort={true}>Location</TableHeaderColumn>
              </BootstrapTable>
            }
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default connect (
  state => ({
    fuelSuppliersData: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data,
    searchFuelSuppliersData: state.rootReducer[ReducerTypes.SEARCH_FUEL_SUPPLIERS].data,
    searchFuelSuppliersSuccess: state.rootReducer[ReducerTypes.SEARCH_FUEL_SUPPLIERS].success,
  }),
  dispatch => ({
    getFuelSuppliers: () => {
      dispatch(getFuelSuppliers());
    },
    searchFuelSuppliers: (name, city) => {
      dispatch(searchFuelSuppliers(name, city));
    },
    searchFuelSuppliersReset: () => {
      dispatch(searchFuelSuppliersReset());
    }
  })
)(FuelSuppliers)

