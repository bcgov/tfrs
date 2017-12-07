import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import * as Routes from '../../constants/routes.jsx';
import { getOrganizations, searchOrganizations, searchOrganizationsReset, addOrganization } from '../../actions/organizationActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class Organizations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrganizationName: '',
      newOrganizationCity: '',
      showModal: false,
      OrganizationDetails: [],
      showOrganizationDetails: false,
    };
  }

  componentDidMount() {
    this.props.getOrganizations();
  }

  handleCheckboxChange() {
  }

  handleCloseModal() {
    this.setState({showModal: false});
    this.props.searchOrganizationsReset();
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.searchOrganizations(this.state.newOrganizationName, this.state.newOrganizationCity);
  }

  handleAddOrganization(id) {
    this.props.addOrganization(id);
  }

  nameFormatter(cell, row) {
    return (
      <Link to={Routes.ORGANIZATIONS + '/' + row.id}>{cell}</Link>
    );
  }

  actionsFormatter(cell, row) {
    let actionTypes = this.props.OrganizationActionTypes.data;
    let info = actionTypes.map((actionType) => {
      if (row.OrganizationActionsTypeId === actionType.id) {
        return actionType.type
      }
    });
    return (
      <span>{info}</span>
    )
  }

  statusFormatter(cell, row) {
    let statusString = '';
    this.props.OrganizationStatuses.data.map(function(status) {
      if (status.id === row.OrganizationStatusFK) {
        statusString = status.status;
      }
    });
    return statusString;
  }

  createCustomButtonGroup(props) {
    return (
      <div>
        <h1 className='header'>Organizations</h1>
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
      OrganizationDetails: props,
      showOrganizationDetails: true,
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
    console.log("org data", this.props.Organizations.data)
    return (
      <div className="organizations row">
        <div className="organizations-table col-lg-12">
          <BootstrapTable 
            data={this.props.Organizations.data}
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
              dataField="status" 
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
          className="new-organization-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">New Organization</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => this.handleSearch(e)}>
              <div className="field-container">
                <label htmlFor="name-field">Name:</label>
                <div className="input-container">
                  <input id="name-field" type="text" onChange={(e) => this.setState({newOrganizationName: e.target.value})} />
                </div>
              </div>
              <div className="field-container">
                <label htmlFor="city-field">City:</label>
                <div className="input-container">
                  <input id="city-field" type="text" placeholder="optional" onChange={(e) => this.setState({newOrganizationCity: e.target.value})} />
                </div>
              </div>
              <div className="btn-container">
                <button className="btn btn-default" type="button" onClick={() => this.handleCloseModal()}>Cancel</button>
                <button type="submit" className="btn btn-primary not-implemented">Search</button>
              </div>
            </form>
            { this.props.searchOrganizationsSuccess &&
              <BootstrapTable 
                data={this.props.searchOrganizationsData}
                selectRow={ selectRowProp }
                hover
              >
                <TableHeaderColumn className="name" dataField="name" isKey={true} dataSort={true}>Organization</TableHeaderColumn>
                <TableHeaderColumn dataField="status" dataSort={true}>Location</TableHeaderColumn>
              </BootstrapTable>
            }
          </Modal.Body>
        </Modal>
        { this.state.showOrganizationDetails &&
        <Modal
          container={this}
          show={this.state.showOrganizationDetails}
          onHide={() => this.setState({showOrganizationDetails: false})}
          aria-labelledby="contained-modal-title"
          className="new-organization-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">New Organization</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <div>{this.state.OrganizationDetails.name}</div>
              { this.props.addOrganizationSuccess && 
              <div className="alert alert-success">Organization successfully added</div>
              }
            </Modal.Body>
            <Modal.Footer>
            { !this.props.addOrganizationSuccess ? 
              <div>
                <button type="button" className="btn btn-default" onClick={() => this.setState({showOrganizationDetails: false})}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={(id) => this.handleAddOrganization(this.state.OrganizationDetails.id)}>Add New Organization</button>
              </div>
              :
              <button type="button" className="btn btn-primary" onClick={() => this.setState({showOrganizationDetails: false})}>Okay</button>
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
    Organizations: state.rootReducer[ReducerTypes.GET_ORGANIZATIONS],
    OrganizationActionTypes: state.rootReducer[ReducerTypes.ORGANIZATION_ACTION_TYPES],
    OrganizationStatuses: state.rootReducer[ReducerTypes.ORGANIZATION_STATUSES],
    searchOrganizationsData: state.rootReducer[ReducerTypes.SEARCH_ORGANIZATIONS].data,
    searchOrganizationsSuccess: state.rootReducer[ReducerTypes.SEARCH_ORGANIZATIONS].success,
    addOrganizationSuccess: state.rootReducer[ReducerTypes.ADD_ORGANIZATION].success,
  }),
  dispatch => ({
    getOrganizations: () => {
      dispatch(getOrganizations());
    },
    searchOrganizations: (name, city) => {
      dispatch(searchOrganizations(name, city));
    },
    searchOrganizationsReset: () => {
      dispatch(searchOrganizationsReset());
    },
    addOrganization: (id) => {
      dispatch(addOrganization(id));
    }
  })
)(Organizations)

