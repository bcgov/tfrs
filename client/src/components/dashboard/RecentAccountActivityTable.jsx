import React, { Component } from 'react';
import * as Routes from '../../constants/routes.jsx';
import * as Values from '../../constants/values.jsx';
import { plainEnglishPhrase } from '../../utils/functions.jsx';
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
      modalProposalDescription: plainEnglishPhrase(row),
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
        { row.creditTradeStatusFK == Values.STATUS_PROPOSED &&
          <button className="simple-btn" data-toggle="modal" data-target="#credit-transfer-modal" onClick={() => this.handleAcceptClick(row)}>Accept</button>
        }
        <Link to={Routes.CREDIT_TRANSFER + row.id} className="counter-btn">{ row.creditTradeStatusFK == Values.STATUS_DRAFT ? 'Edit' : 'View'}</Link>
      </div>
    )
  }

  statusFormatter(cell, row) {
    let statusString = '';
    this.props.creditTradeStatuses.map(function(status) {
      if (status.id === row.creditTradeStatusFK) {
        statusString = status.status;
      }
    });
    return (
      <div>{statusString}</div>
    )
  }

  descriptionFormatter(cell, row) {
    return (
      <div>{plainEnglishPhrase(row)}</div>
    )
  }
  
  render() {
    return (
      <div className="account-activity-table">
        <BootstrapTable data={this.props.accountActivityData}>
          <TableHeaderColumn 
            className="proposalDescription" 
            dataField="plainEnglishPhrase" 
            isKey={true} 
            dataFormat={(cell, row) => this.descriptionFormatter(cell, row)}
            columnClassName="proposal-description">
            Proposal Description
          </TableHeaderColumn>
          <TableHeaderColumn dataField="tradeEffectiveDate" dataSort={true}>Last Updated</TableHeaderColumn>
          <TableHeaderColumn dataField="creditTradeStatusFK" dataFormat={(cell, row) => this.statusFormatter(cell, row)}>Status</TableHeaderColumn>
          <TableHeaderColumn dataField="id" dataFormat={(cell, row) => this.actionsFormatter(cell, row)} columnClassName="actions">Actions</TableHeaderColumn>
        </BootstrapTable>
        <Modal
          show={this.state.showModal}
          onHide={() => this.handleCloseModal()}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Accept Proposal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.modalProposalDescription}</p>
            <div className="form-group note">             
              <label>Note:</label>
              <textarea 
                className="form-control note" 
                rows="4" 
                onChange={(e) => this.handleNoteChange(e)} />
            </div>
            { this.props.acceptCreditTransferSuccess && 
              <div className="alert alert-success">Credit transfer successfully accepted</div>
            }
          </Modal.Body>
          <Modal.Footer>
            { !this.props.acceptCreditTransferSuccess ? 
              <div>
                <button type="button" className="btn btn-default" onClick={() => this.handleCloseModal()}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => this.props.handleAcceptCreditTransfer(this.state.modalProposalID, this.state.note)}>Accept</button>
              </div> 
              : 
              <button type="button" className="btn btn-primary" onClick={() => this.handleCloseModal()}>Okay</button>
            }
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default RecentAccountActivityTable;