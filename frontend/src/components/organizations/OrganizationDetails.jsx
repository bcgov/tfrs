import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  getOrganization,
  getOrganizationType,
  getOrganizationStatus
} from '../../actions/organizationActions';
import * as ReducerTypes from '../../constants/reducerTypes';
import * as Values from '../../constants/values';
import { 
  addContact, 
  addContactReset,
  deleteContact,
  deleteContactReset,
  verifyID, 
  verifyIDReset } from '../../actions/organizationActions';
import { Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import AddContactForm from './AddContactForm';
import UploadDocumentForm from './UploadDocumentForm';
import ChangeStatusForm from './ChangeStatusForm';

class OrganizationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddContactModal: false,
      showUploadDocumentModal: false,
      showChangeStatusModal: false,
      showDeleteContactModal: false,
      contactName: '',
      contactRole: '',
      contactEmail: '',
      contactWorkPhone: '',
      contactCellPhone: '',
      contactBCeID: '',
      contactID: '',
      contacts: [],
      OrganizationAttachments: null,
    };
  }
  
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.getOrganization(id);
    if (this.props.OrganizationContacts.data != null) {
      this.filterContacts();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.OrganizationContacts !== this.props.OrganizationContacts) && 
      this.props.OrganizationContacts.data && 
      this.props.OrganizationContacts.data.length > 0) {
        this.filterContacts();
    }
    if (this.state.OrganizationAttachments == null && this.props.OrganizationAttachmentsSuccess) {
      this.filterAttachments();
    }
  }

  filterContacts() {
    let id = parseInt(this.props.match.params.id);
    let contacts = this.props.OrganizationContacts.data.filter(contact => {
      return contact['OrganizationFK'] === id
    })
    this.setState({contacts: contacts});
  }

  filterAttachments() {
    let id = parseInt(this.props.match.params.id);
    let attachments = this.props.OrganizationAttachments.filter(attachment => {
      return attachment['OrganizationFK'] === id
    })
    this.setState({OrganizationAttachments: attachments});
  }

  openAddContactModal() {
    this.setState({showAddContactModal: true})
  }

  closeAddContactModal() {
    this.setState({showAddContactModal: false});
    this.props.verifyIDReset();
    this.props.addContactReset();
  }

  handleInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  openDeleteContactModal() {
    this.setState({showDeleteContactModal: true})
  }

  closeDeleteContactModal() {
    this.setState({showDeleteContactModal: false});
    this.props.deleteContactReset();
  }

  handleVerifyID() {
    this.props.verifyID(this.state.contactBCeID);
  }

  toggleModal(name) {
    this.setState({[name]: !this.state[name]})
  }

  handleToggleDelete(id) {
    this.toggleModal('showDeleteContactModal');
    this.setState({contactID: id})
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
        <button className="btn btn-link not-implemented">Download</button>
        <button className="btn btn-link not-implemented">Delete</button>
      </div>
    )
  }

  contactsActionsFormatter(cell, row) {
    return (
      <div>
        <button className="btn btn-link not-implemented">Edit</button>
        <button 
          className="btn btn-link"
          onClick={(id) => this.handleToggleDelete(row.id)}>Delete</button>
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
            <button 
              className="btn btn-primary"
              onClick={() => this.toggleModal('showUploadDocumentModal')}>
              Add
            </button>
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
      <div className="row organization-details">
        { this.props.OrganizationData &&
        <div>
          <div className="col-lg-12 header-container">
            <h1 className="title">{this.props.OrganizationData.name}</h1>
            <div className="badge-container">
              {this.props.OrganizationStatuses && 
                this.props.OrganizationStatuses.map((status) => (
                status.id === this.props.OrganizationData.OrganizationStatusFK &&
                  <span className={status.status === Values.STATUS_ARCHIVED ? "label label-default" : "label label-success"}>{status.status}</span>
              ))}
              <button 
                className="btn-no-style"
                onClick={() => this.toggleModal('showChangeStatusModal')}>
                <i className="fa fa-pencil"></i>
              </button>
            </div>
          </div>
          <Modal
            show={this.state.showChangeStatusModal}
            onHide={(name) => this.toggleModal('showChangeStatusModal')}
            container={this}
            aria-labelledby="contained-modal-title"
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Change Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChangeStatusForm 
                Organization={this.props.OrganizationData}
                OrganizationStatuses={this.props.OrganizationStatuses}
                OrganizationTypes={this.props.OrganizationTypes}
                OrganizationActions={this.props.OrganizationActions}
                closeChangeStatusModal={(name) => this.toggleModal('showChangeStatusModal')} />
            </Modal.Body>
          </Modal>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div className="organization-info">
                <h2>Organization Information</h2>
                <div>
                  <span className="info-label">Name:</span><span className="info">{this.props.OrganizationData.name}</span>
                </div>
                <div>
                  <span className="info-label">Corporate Address:</span><span className="info">{this.props.OrganizationData.address}</span>          
                </div>
                <div className="account-balance-container">
                  <h2>Account Balance</h2>
                  <div>
                    <div className="list-group">
                      <span className="list-group-item">
                        <span className="pull-right">50</span>
                        Credits
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contacts col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <button 
                className="btn btn-primary add-btn"
                onClick={() => this.openAddContactModal()}>Add Contact</button>
              <BootstrapTable data={this.state.contacts}>
                <TableHeaderColumn 
                  dataField="name"
                  isKey={true} 
                  dataFormat={(cell, row) => this.nameFormatter(cell, row)}>
                  Contact
                </TableHeaderColumn>
                <TableHeaderColumn dataField="workPhoneNumber" dataSort={true}>Phone Number</TableHeaderColumn>
                <TableHeaderColumn dataField="emailAddress" dataSort={true}>Email</TableHeaderColumn>
                <TableHeaderColumn dataField="title" columnClassName="role">Role</TableHeaderColumn>
                <TableHeaderColumn dataField="id" dataFormat={(cell, row) => this.contactsActionsFormatter(cell, row)} columnClassName="actions">Actions</TableHeaderColumn>
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
                    OrganizationData={this.props.OrganizationData}
                    verifyIDSuccess={this.props.verifyIDSuccess}
                    verifyIDError={this.props.verifyIDError}
                    addContact={(contact) => this.props.addContact(contact)}
                    addContactIsFetching={this.props.addContactIsFetching}
                    addContactSuccess={this.props.addContactSuccess}
                  />
                </Modal.Body>
              </Modal>
              <Modal
                show={this.state.showDeleteContactModal}
                onHide={() => this.closeDeleteContactModal()}
                container={this}
                aria-labelledby="contained-modal-title"
                className="delete-contact-modal"
                >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title">Delete Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this contact?
                </Modal.Body>
                <Modal.Footer>
                { this.props.deleteContactSuccess && 
                  <div className="alert alert-success">Contact successfully deleted</div>
                }
                { !this.props.deleteContactSuccess ? 
                  <div>
                    <button 
                      type="button" 
                      className="btn btn-default" 
                      onClick={() => this.closeDeleteContactModal()}>
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={(id) => this.props.deleteContact(this.state.contactID)}>
                      Confirm
                    </button>
                  </div> 
                  :
                  <button 
                    type="button" 
                    className="btn btn-default" 
                    onClick={() => this.closeDeleteContactModal()}>
                    Okay
                  </button>
                }
                </Modal.Footer>
              </Modal>
            </div>
        </div>
        <div className="row">
          <div className="correspondence-table col-lg-12">
            <BootstrapTable 
              data={this.state.OrganizationAttachments}
              options={ options }
              search
            >
              <TableHeaderColumn dataField="fileName" isKey={true} dataSort={true}>Document Name</TableHeaderColumn>
              <TableHeaderColumn dataField="description" dataSort={true}>Notes</TableHeaderColumn>
              <TableHeaderColumn dataField="complianceYear" dataSort={true}>Compliance Year</TableHeaderColumn>
              <TableHeaderColumn dataField="tags">Tags</TableHeaderColumn>
              <TableHeaderColumn dataField="date_uploaded">Date Uploaded</TableHeaderColumn>
              <TableHeaderColumn dataField="by">By</TableHeaderColumn>
              <TableHeaderColumn dataField="of">Of</TableHeaderColumn>
              <TableHeaderColumn columnClassName="actions" dataFormat={(cell, row) => this.documentsActionsFormatter(cell, row)}>Actions</TableHeaderColumn>
            </BootstrapTable>
            <Modal
                show={this.state.showUploadDocumentModal}
                onHide={() => this.toggleModal('showUploadDocumentModal')}
                container={this}
                aria-labelledby="contained-modal-title"
              >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Upload Document</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <UploadDocumentForm />
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <button 
                    type="button" 
                    className="btn btn-default" 
                    onClick={() => this.toggleModal('showUploadDocumentModal')}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary not-implemented">
                    Save
                  </button>
                </div> 
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <div className="row">
          <div className="history-table col-lg-12">
            <BootstrapTable 
              data={this.props.OrganizationData.history}
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
    OrganizationData: state.rootReducer[ReducerTypes.GET_ORGANIZATION].data,
    OrganizationContacts: state.rootReducer[ReducerTypes.ORGANIZATION_CONTACTS],
    OrganizationTypes: state.rootReducer[ReducerTypes.ORGANIZATION_TYPES].data,
    OrganizationStatuses: state.rootReducer[ReducerTypes.ORGANIZATION_STATUSES].data,
    OrganizationActions: state.rootReducer[ReducerTypes.ORGANIZATION_ACTION_TYPES].data,
    OrganizationAttachments: state.rootReducer[ReducerTypes.ORGANIZATION_ATTACHMENTS].data,
    OrganizationAttachmentsSuccess: state.rootReducer[ReducerTypes.ORGANIZATION_ATTACHMENTS].success,
    verifyIDSuccess: state.rootReducer[ReducerTypes.VERIFY_ID].success,
    verifyIDError: state.rootReducer[ReducerTypes.VERIFY_ID].errorMessage,
    deleteContactSuccess: state.rootReducer[ReducerTypes.DELETE_CONTACT].success,
    addContactSuccess: state.rootReducer[ReducerTypes.ADD_CONTACT].success,
  }),
  dispatch => ({
    getOrganization: (id) => {
      dispatch(getOrganization(id));
    },
    getOrganizationType: (id) => {
      dispatch(getOrganizationType(id));
    },
    getOrganizationStatus: (id) => {
      dispatch(getOrganizationStatus(id));
    },
    addContact: (data) => {
      dispatch(addContact(data));
    },
    addContactReset: () => {
      dispatch(addContactReset());
    },
    deleteContact: (id) => {
      dispatch(deleteContact(id));
    },
    deleteContactReset: () => {
      dispatch(deleteContactReset());
    },  
    verifyID: (id) => {
      dispatch(verifyID(id));
    },
    verifyIDReset: () => {
      dispatch(verifyIDReset());
    }
  })
)(OrganizationDetails)
