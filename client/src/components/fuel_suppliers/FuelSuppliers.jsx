import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import * as Routes from '../../constants/routes.jsx';
import { getFuelSuppliers, searchFuelSuppliers, searchFuelSuppliersReset, addFuelSupplier } from '../../actions/fuelSuppliersActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class FuelSuppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newFuelSupplierName: '',
      newFuelSupplierCity: '',
      showModal: false,
      fuelSupplierDetails: [],
      showFuelSupplierDetails: false,
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

  handleAddFuelSupplier(id) {
    this.props.addFuelSupplier(id);
  }

  nameFormatter(cell, row) {
    return (
      <Link to={Routes.FUEL_SUPPLIERS + row.id}>{cell}</Link>
    );
  }

  createCustomButtonGroup(props) {
    return (
      <div>
        <h1 className='header'>Fuel Suppliers</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="simple-btn" onClick={() => this.setState({ showModal: true})}>Add</button>
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

  selectSearchFieldSuppliers(props) {
    this.setState({
      fuelSupplierDetails: props,
      showFuelSupplierDetails: true,
    })
  }
  
  render() {
    const options = {
      toolBar: this.createCustomButtonGroup.bind(this)
    };
    const selectRowProp = {
      mode: 'radio',
      hideSelectColumn: true, 
      clickToSelect: true,
      onSelect: this.selectSearchFieldSuppliers.bind(this)
    };
    return (
      <div className="fuel-suppliers row">
        <div className="fuel-suppliers-table col-lg-12">
          <BootstrapTable 
            data={this.props.fuelSuppliersData}
              options={ options }
              search
            >
            <TableHeaderColumn className="name" dataField="name" dataFormat={(cell, row) => this.nameFormatter(cell, row)} isKey={true} dataSort={true}>Name</TableHeaderColumn>
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
                selectRow={ selectRowProp }
                hover
              >
                <TableHeaderColumn className="name" dataField="name" isKey={true} dataSort={true}>Organization</TableHeaderColumn>
                <TableHeaderColumn dataField="status" dataSort={true}>Location</TableHeaderColumn>
              </BootstrapTable>
            }
          </Modal.Body>
        </Modal>
        { this.state.showFuelSupplierDetails &&
        <Modal
          container={this}
          show={this.state.showFuelSupplierDetails}
          onHide={() => this.setState({showFuelSupplierDetails: false})}
          aria-labelledby="contained-modal-title"
          className="new-fuel-supplier-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">New Fuel Supplier</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <div>{this.state.fuelSupplierDetails.name}</div>
              { this.props.addFuelSupplierSuccess && 
              <div className="alert alert-success">Fuel Supplier successfully added</div>
              }
            </Modal.Body>
            <Modal.Footer>
            { !this.props.addFuelSupplierSuccess ? 
              <div>
                <button type="button" className="btn btn-default" onClick={() => this.setState({showFuelSupplierDetails: false})}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={(id) => this.handleAddFuelSupplier(this.state.fuelSupplierDetails.id)}>Add New Fuel Supplier</button>
              </div>
              :
              <button type="button" className="btn btn-primary" onClick={() => this.setState({showFuelSupplierDetails: false})}>Okay</button>
            }
            </Modal.Footer>
          </Modal>
          }
      </div>
    );
  }
}

export default connect (
  state => ({
    fuelSuppliersData: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data,
    searchFuelSuppliersData: state.rootReducer[ReducerTypes.SEARCH_FUEL_SUPPLIERS].data,
    searchFuelSuppliersSuccess: state.rootReducer[ReducerTypes.SEARCH_FUEL_SUPPLIERS].success,
    addFuelSupplierSuccess: state.rootReducer[ReducerTypes.ADD_FUEL_SUPPLIER].success,
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
    },
    addFuelSupplier: (id) => {
      dispatch(addFuelSupplier(id));
    }
  })
)(FuelSuppliers)

