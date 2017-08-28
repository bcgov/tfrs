import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { getAccountActivity } from '../../actions/accountActivityActions.jsx';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import * as Routes from '../../constants/routes.jsx';
import * as Values from '../../constants/values.jsx';
import { plainEnglishPhrase, plainEnglishPhraseString } from '../../utils/functions.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

function descriptionFilterType(cell, row) {
  let filter = plainEnglishPhraseString(row);
  return filter;
}

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

  handleCheckboxChange() {
  }

  createCustomButtonGroup(props) {
    return (
      <div>
        <h1 className='header'>Account Activity</h1>
        <div className='right-toolbar-container'> 
          <div className="actions-container">
            <Link to={Routes.CREDIT_TRANSFER}>Propose Trade</Link>
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

  statusFormatter(cell, row) {
    let statusString = '';
    this.props.creditTradeStatuses.map(function(status) {
      if (status.id === row.creditTradeStatusFK) {
        statusString = status.status;
      }
    });
    return (
      statusString
    )
  }

  descriptionFormatter(cell, row) {
    return (
      <div>{plainEnglishPhrase(row)}</div>
    )
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
          <TableHeaderColumn 
            className="proposalDescription" 
            dataField="plainEnglishPhrase" 
            isKey={true} 
            filterValue={ descriptionFilterType }
            dataFormat={(cell, row) => this.descriptionFormatter(cell, row)}
            columnClassName="proposal-description">
            Proposal Description
          </TableHeaderColumn>
          <TableHeaderColumn 
            dataField="tradeEffectiveDate" 
            dataSort={true}>
            Last Updated
          </TableHeaderColumn>
          <TableHeaderColumn 
            dataField="creditTradeStatusFK" 
            dataFormat={(cell, row) => this.statusFormatter(cell, row)}
            filterFormatted={true}>
            Status
          </TableHeaderColumn>
          <TableHeaderColumn 
            dataField="id" 
            dataFormat={(cell, row) => this.actionsFormatter(cell, row)} 
            columnClassName="actions">
            Actions
          </TableHeaderColumn>
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
            <button type="button" className="btn btn-default" onClick={() => this.handleCloseModal()}>Cancel</button>
            <button type="button" className="btn btn-primary not-implemented">Accept</button>
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
    creditTradeStatuses: state.rootReducer[ReducerTypes.CREDIT_TRADE_STATUSES].data,
  }),
  dispatch => ({
    getAccountActivity: () => {
      dispatch(getAccountActivity());
    },
  })
)(AccountActivity);