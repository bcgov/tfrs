import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Modal } from 'react-bootstrap';

class RecentAccountActivityTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalProposalDescription: '',
      modalProposalID: '',
      showModal: false,
      note: '',
    };
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
        <button className="accept-btn" onClick={() => this.handleAcceptClick(row)}>Accept</button>
        <Link to="/" className="counter-btn">Counter</Link>
      </div>
    )
  }
  
  render() {
    return (
      <div className="account-activity-table">
        <BootstrapTable data={this.props.accountActivityData}>
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
    );
  }
}

export default RecentAccountActivityTable;