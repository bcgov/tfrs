import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFuelSupplier } from '../../actions/fuelSuppliersActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { addContact, verifyID, verifyIDReset } from '../../actions/fuelSuppliersActions.jsx';
import { Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
    this.props.getFuelSupplier(this.props.match.params.id);
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
            <button 
              className="btn btn-primary"
              onClick={() => this.openAddContactModal()}>Add</button>
            <BootstrapTable data={this.props.fuelSupplierData.contacts}>
              <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Contact</TableHeaderColumn>
              <TableHeaderColumn dataField="phone" dataSort={true}>Phone Number</TableHeaderColumn>
              <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
              <TableHeaderColumn dataField="role" columnClassName="actions">Role</TableHeaderColumn>
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
              <form className="form-horizontal add-contact-form" onSubmit={() => this.handleAddContact()}>
              <Modal.Body>
                  <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="contact-name">Name:</label>
                    <div className="col-sm-10">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="contact-name"
                        name="contactName"
                        onChange={(event) => this.handleInputChange(event)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="contact-role">Role:</label>
                    <div className="col-sm-10">
                      <select 
                        className="form-control" 
                        id="contact-role" 
                        name="contactRole"
                        onChange={(event) => this.handleInputChange(event)} >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="contact-email">Email:</label>
                    <div className="col-sm-10">
                      <input 
                        type="email" 
                        className="form-control" 
                        id="contact-email"
                        name="contactEmail"
                        onChange={(event) => this.handleInputChange(event)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="contact-work-phone">Work Phone:</label>
                    <div className="col-sm-10">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="contact-work-phone" 
                        name="contactWorkPhone"
                        onChange={(event) => this.handleInputChange(event)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="contact-cell-phone">Cell Phone:</label>
                    <div className="col-sm-10">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="contact-cell-phone"
                        name="contactCellPhone"
                        onChange={(event) => this.handleInputChange(event)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="contact-bceid">BCeID:</label>
                    <div className="col-sm-10">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="contact-bceid"
                        name="contactBCeID"
                        onChange={(event) => this.handleInputChange(event)} />
                      { this.props.verifyIDSuccess && 
                        <div className="alert alert-success">Valid BCeID</div>
                      }
                      { this.props.verifyIDError.length > 0 && 
                        <div className="alert alert-warning">{this.props.verifyIDError}</div>
                      }
                      <input 
                        type="button" 
                        className="btn btn-default verify-btn" 
                        value="verify"
                        onClick={() => this.handleVerifyID()} />
                    </div>
                  </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="form-group"> 
                  <div className="col-sm-offset-2 col-sm-10 btn-container">
                    <input type="button" className="btn btn-default" onClick={() => this.closeAddContactModal()} value="Cancel" />
                    <input type="submit" className="btn btn-primary" value="save" />
                  </div>
                </div>
              </Modal.Footer>
            </form>
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
    );
  }
}

export default connect (
  state => ({
    fuelSupplierData: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIER].data,
    verifyIDSuccess: state.rootReducer[ReducerTypes.VERIFY_ID].success,
    verifyIDError: state.rootReducer[ReducerTypes.VERIFY_ID].errorMessage,
  }),
  dispatch => ({
    getFuelSupplier: (id) => {
      dispatch(getFuelSupplier(id));
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
