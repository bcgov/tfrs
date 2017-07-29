import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { getAccountActivity, acceptCreditTransfer, acceptCreditTransferReset } from '../../actions/accountActivityActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class AccountActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalProposalDescription: '',
      modalProposalID: '',
      showModal: false,
      note: '',
    };
  }

  componentDidMount() {
    this.props.getAccountActivity();
  }

  handleAcceptCreditTransfer(id, note) {
    this.props.acceptCreditTransfer(id, note);
  }

  handleAcceptClick(row) {
    this.setState({
      modalProposalDescription: row.proposalDescription,
      modalProposalID: row.id,
      showModal: true,
    });
  }

  handleNoteChange(e) {
    this.setState({note: e.target.value})
  }


  handleCloseModal() {
    this.setState({showModal: false});
    this.props.acceptCreditTransferReset();
  }

  actionsFormatter(cell, row) {
    return (
      <div>
        <button className="accept-btn" data-toggle="modal" data-target="#credit-transfer-modal" onClick={() => this.handleAcceptClick(row)}>Accept</button>
        <Link to="/" className="counter-btn">Counter</Link>
      </div>
    )
  }

  handleCheckboxChange() {
  }

  createCustomButtonGroup(props) {
    return (
      <div>
        <h1 className='header'>Account Activity</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <button className="btn btn-primary">Propose Trade</button>
            <label className="checkbox"> 
              <input type="checkbox" onChange={() => this.handleCheckboxChange()} />
              Last 12 months
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
      <div className="account-activity row">
        <div className="account-activity-table col-lg-12">
        <BootstrapTable 
          data={this.props.accountActivityData}
            options={ options }
            search
          >
          <TableHeaderColumn className="proposalDescription" dataField="proposalDescription" isKey={true} dataSort={true} columnClassName="proposal-description">Proposal Description</TableHeaderColumn>
          <TableHeaderColumn dataField="lastUpdated" dataSort={true}>Last Updated</TableHeaderColumn>
          <TableHeaderColumn dataField="status" dataSort={true}>Status</TableHeaderColumn>
          <TableHeaderColumn dataField="id" dataFormat={(cell, row) => this.actionsFormatter(cell, row)} columnClassName="actions">Actions</TableHeaderColumn>
        </BootstrapTable>
        <Modal
          show={this.state.showModal}
          onHide={() => this.handleCloseModal()}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.modalProposalDescription}</p>
            <div className="note-container">                
              <label>Note:</label>
              <textarea className="note" rows="4" onChange={(e) => this.handleNoteChange(e)} />
            </div>
            { this.props.acceptCreditTransferSuccess && 
              <div className="alert alert-success">Credit transfer successfully accepted</div>
            }
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-default" onClick={() => this.handleCloseModal()}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={() => this.props.handleAcceptCreditTransfer(this.state.modalProposalID, this.state.note)}>Accept</button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
    );
  }
}

export default connect (
  state => ({
    accountActivityData: state.rootReducer[ReducerTypes.GET_ACCOUNT_ACTIVITY].data,
    acceptCreditTransferSuccess: state.rootReducer[ReducerTypes.ACCEPT_CREDIT_TRANSFER].success,
  }),
  dispatch => ({
    getAccountActivity: () => {
      dispatch(getAccountActivity());
    },
    acceptCreditTransfer: (id, note) => {
      dispatch(acceptCreditTransfer(id, note));
    },
    acceptCreditTransferReset: () => {
      dispatch(acceptCreditTransferReset());
    }
  })
)(AccountActivity);