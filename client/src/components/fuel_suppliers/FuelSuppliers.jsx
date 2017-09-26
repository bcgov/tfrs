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

  actionsFormatter(cell, row) {
    let actionTypes = this.props.fuelSupplierActionTypes.data;
    let info = actionTypes.map((actionType) => {
      if (row.fuelSupplierActionsTypeId === actionType.id) {
        return actionType.type
      }
    });
    return (
      <span>{info}</span>
    )
  }

  statusFormatter(cell, row) {
    let statusString = '';
    this.props.fuelSupplierStatuses.data.map(function(status) {
      if (status.id === row.fuelSupplierStatusFK) {
        statusString = status.status;
      }
    });
    return statusString;
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
            data={this.props.fuelSuppliers.data}
              options={ options }
              search
            >
            <TableHeaderColumn 
              className="name" 
              dataField="name" 
              dataFormat={(cell, row) => this.nameFormatter(cell, row)} 
              isKey={true} 
              dataSort={true}>
              Name
            </TableHeaderColumn>
            <TableHeaderColumn 
              dataField="fuelSupplierStatusFK" 
              dataFormat={(cell, row) => this.statusFormatter(cell, row)}
              filterFormatted={true}>
              Status
            </TableHeaderColumn>
            <TableHeaderColumn dataField="actionsPermitted" dataSort={true} dataFormat={(cell, row) => this.actionsFormatter(cell, row)}>Actions Permitted</TableHeaderColumn>
            <TableHeaderColumn dataField="creditBalance" dataSort={true}>Credit Balance</TableHeaderColumn>
            <TableHeaderColumn dataField="lastTransaction" dataSort={true}>Last Transaction</TableHeaderColumn>
            <TableHeaderColumn dataField="pendingActions" columnClassName="actions">Pending Actions</TableHeaderColumn>
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
                <button className="btn btn-default" type="button" onClick={() => this.handleCloseModal()}>Cancel</button>
                <button type="submit" className="btn btn-primary not-implemented">Search</button>
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
    fuelSuppliers: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS],
    fuelSupplierActionTypes: state.rootReducer[ReducerTypes.FUEL_SUPPLIER_ACTION_TYPES],
    fuelSupplierStatuses: state.rootReducer[ReducerTypes.FUEL_SUPPLIER_STATUSES],
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

