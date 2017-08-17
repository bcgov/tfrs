import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  getFuelSupplier,
  getFuelSupplierContacts,
  getFuelSupplierType,
  getFuelSupplierStatus
} from '../../actions/fuelSuppliersActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { addContact, verifyID, verifyIDReset } from '../../actions/fuelSuppliersActions.jsx';
import { Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import AddContactForm from './AddContactForm.jsx';

class FuelSupplierDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddContactModal: false,
      contactName: '',
      contactRole: '',
      contactEmail: '',
      contactWorkPhone: '',
      contactCellPhone: '',
      contactBCeID: '',
    };
  }
  
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.getFuelSupplier(id);
    this.props.getFuelSupplierContacts(id);
    this.props.getFuelSupplierType(id);
    this.props.getFuelSupplierStatus(id)
  }

  openAddContactModal() {
    this.setState({showAddContactModal: true})
  }

  closeAddContactModal() {
    this.setState({showAddContactModal: false});
    this.props.verifyIDReset();
  }

  handleInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleVerifyID() {
    this.props.verifyID(this.state.contactBCeID);
  }

  handleAddContact() {
    let contactData = {
      contactName: this.state.contactName,
      contactRole: this.state.contactRole,
      contactEmail: this.state.contactEmail,
      contactWorkPhone: this.state.contactWorkPhone,
      contactCellPhone: this.state.contactCellPhone,
      contactBCeID: this.state.contactBCeID,
    }
    this.props.addContact(contactData);
  }

  documentsActionsFormatter(cell, row) {
    return (
      <div>
        <button className="btn btn-default">Download</button>
        <button className="btn btn-default">Delete</button>
      </div>
    )
  }

  nameFormatter(cell, row) {
    return (
      <span>{row.givenName + ' ' + row.surname}</span>
    )
  }

  documentsSearchPanel(props) {
    return (
      <div>
        <h1 className='header'>Correspondence</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="btn-link">Add</button>
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
        { this.props.fuelSupplierData &&
        <div>
          <h1 className="col-lg-12">{this.props.fuelSupplierData.name}</h1>
          <div className="col-lg-12">
            <span>{this.props.fuelSupplierType && this.props.fuelSupplierType.type}</span>
            <span> - {this.props.fuelSupplierStatus && this.props.fuelSupplierStatus.status}</span>
          </div>
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
              <button 
                className="btn-link add-btn"
                onClick={() => this.openAddContactModal()}>Add Contact</button>
              <BootstrapTable data={this.props.fuelSupplierContacts.data}>
                <TableHeaderColumn 
                  dataField="name"
                  isKey={true} 
                  dataSort={true}
                  dataFormat={(cell, row) => this.nameFormatter(cell, row)}>
                  Contact
                </TableHeaderColumn>
                <TableHeaderColumn dataField="workPhoneNumber" dataSort={true}>Phone Number</TableHeaderColumn>
                <TableHeaderColumn dataField="emailAddress" dataSort={true}>Email</TableHeaderColumn>
                <TableHeaderColumn dataField="title" columnClassName="actions">Role</TableHeaderColumn>
              </BootstrapTable>
              <Modal
                show={this.state.showAddContactModal}
                onHide={() => this.closeAddContactModal()}
                container={this}
                aria-labelledby="contained-modal-title"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title">Add Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddContactForm
                    closeAddContactModal={() => this.closeAddContactModal()} 
                    fuelSupplierData={this.props.fuelSupplierData}
                    verifyIDSuccess={this.props.verifyIDSuccess}
                    verifyIDError={this.props.verifyIDError}
                    addContact={(contact) => this.props.addContact(contact)}
                  />
                </Modal.Body>
              </Modal>
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
      }
    </div>
    );
  }
}

export default connect (
  state => ({
    fuelSupplierData: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIER].data,
    fuelSupplierContacts: state.rootReducer[ReducerTypes.FUEL_SUPPLIER_CONTACTS],
    fuelSupplierType: state.rootReducer[ReducerTypes.FUEL_SUPPLIER_TYPE].data,
    fuelSupplierStatus: state.rootReducer[ReducerTypes.FUEL_SUPPLIER_STATUS].data,
    verifyIDSuccess: state.rootReducer[ReducerTypes.VERIFY_ID].success,
    verifyIDError: state.rootReducer[ReducerTypes.VERIFY_ID].errorMessage,
  }),
  dispatch => ({
    getFuelSupplier: (id) => {
      dispatch(getFuelSupplier(id));
    },
    getFuelSupplierContacts: (id) => {
      dispatch(getFuelSupplierContacts(id));
    },
    getFuelSupplierType: (id) => {
      dispatch(getFuelSupplierType(id));
    },
    getFuelSupplierStatus: (id) => {
      dispatch(getFuelSupplierStatus(id));
    },
    addContact: (data) => {
      dispatch(addContact(data));
    },
    verifyID: (id) => {
      dispatch(verifyID(id));
    },
    verifyIDReset: () => {
      dispatch(verifyIDReset());
    }
  })
)(FuelSupplierDetails)
