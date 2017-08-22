import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import * as Values from '../../constants/values.jsx';
import * as Routes from '../../constants/routes.jsx';
import { Modal } from 'react-bootstrap';
import { 
  getCreditTransfer,
  getCreditTransferReset,
  approveCreditTransfer,
  rejectCreditTransfer,
  rescindProposal } from '../../actions/accountActivityActions.jsx';
import { getFuelSuppliers } from '../../actions/fuelSuppliersActions.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import TransactionHistory from './TransactionHistory.jsx';

class CreditTransferNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalType: '',
      valuePerCredit: '',
      numberOfCredits: '',
      showRescindCreditTransferModal: false,
      showApproveCreditTransferModal: false,
      showRejectProposalModal: false,
    };
  }

  componentDidMount() {
    this.props.getFuelSuppliers();
  }

  componentWillUnmount() {
    this.props.getCreditTransferReset();
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleCancel() {
    this.props.history.push(Routes.ACCOUNT_ACTIVITY);
  }

  handleSubmit(event) {
    event.preventDefault();
    const initiator = this.initiator.value;
    const numberOfCredits = this.numberOfCredits.value;
    const respondent = this.respondent.value;
    const valuePerCredit = this.valuePerCredit.value;
    const note = this.note.value;
  }
  
  render() {
    return (
      <div className="credit-transfer">
        <h1>New Credit Transfer</h1>
        <div className="credit-transfer-progress-bar">
          <div className="arrow-steps clearfix">
            <div className="step"><span>Proposed</span></div>
            <div className="step"><span>Accepted</span></div>
            <div className="step"><span>Approved</span></div>
            <div className="step"><span>Complete</span></div>
          </div>
        </div>
        <div className="credit-transfer-details">
          <form className="form-inline" onSubmit={(event) => this.handleSubmit(event)}>
            <div className="main-form">
              <span>{this.props.fuelSuppliers && this.props.fuelSuppliers[0].name} proposes to </span>
              <div className="form-group">
                <select 
                  className="form-control" 
                  id="proposal-type" 
                  name="proposalType"
                  ref={(input) => this.proposalType = input}
                  onChange={(event) => this.handleInputChange(event)}>
                  <option>Sell</option>
                  <option>Buy</option>
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  className="form-control" 
                  id="number-of-credits" 
                  name="numberOfCredits"
                  onChange={(event) => this.handleInputChange(event)}
                  ref={(input) => this.numberOfCredits = input} />
              </div>
              <span>{this.state.proposalType === "Buy" ? "credits from " : "credits to "}</span>
              <div className="form-group">
                <select 
                  className="form-control" 
                  id="respondent" 
                  name="respondent"
                  ref={(input) => this.respondentFK = input}
                  onChange={(event) => this.handleInputChange(event)}>
                  { this.props.fuelSuppliers &&
                    this.props.fuelSuppliers.map((fuelSupplier) => (
                      <option value={fuelSupplier.id}>{fuelSupplier.name}</option>
                  ))}
                </select>
              </div>
              <span>for </span>
              <div className="form-group">
                <input 
                  type="number" 
                  className="form-control" 
                  id="value-per-credit" 
                  name="valuePerCredit"
                  onChange={(event) => this.handleInputChange(event)}
                  ref={(input) => this.valuePerCredit = input} />
              </div>
              <span>per credit for a total value of $</span>
              <span>{ this.state.valuePerCredit * this.state.numberOfCredits }</span>
              <span> effective on Director's Approval</span>
            </div>
            <div className="form-group note">
              <label htmlFor="comment">Note:</label>
              <textarea 
                className="form-control" 
                rows="5" 
                id="note"
                ref={(input) => this.note = input}>
              </textarea>
            </div>
            <div className="btn-container">
              <button 
                type="button" 
                className="btn btn-default"
                onClick={() => this.handleCancel()}>
                Cancel
              </button>
              <button type="button" className="btn btn-default">Save Draft</button>
              <button type="button" className="btn btn-primary">Propose</button>
            </div>
          </form>
        </div>
        <Modal
          container={this}
          show={this.state.showRescindCreditTransferModal}
          onHide={() => this.setState({showRescindCreditTransferModal: false})}
          aria-labelledby="contained-modal-title"
          className="new-fuel-supplier-modal"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Rescind Credit Transfer</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            Clicking "Rescind Proposal" will cancel this proposed Credit Transfer
          </Modal.Body>
          <Modal.Footer>
            <button 
              type="button" 
              className="btn btn-default"
              onClick={() => this.setState({showRescindCreditTransferModal: false})}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={(id) => this.props.rescindProposal(this.props.data.id)}
            >
              Rescind Proposal
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          container={this}
          show={this.state.showApproveCreditTransferModal}
          onHide={() => this.setState({showApproveCreditTransferModal: false})}
          aria-labelledby="contained-modal-title"
          className="new-fuel-supplier-modal"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Approve Credit Transfer</Modal.Title>
        </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <button 
              type="button" 
              className="btn btn-default" 
              onClick={() => this.setState({showApproveCreditTransferModal: false})}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={(id) => this.props.approveCreditTransfer(this.props.data.id)}
            >
              Approve
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          container={this}
          show={this.state.showRejectProposalModal}
          onHide={() => this.setState({showRejectProposalModal: false})}
          aria-labelledby="contained-modal-title"
          className="new-fuel-supplier-modal"
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Reject Credit Transfer</Modal.Title>
        </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <button 
              type="button" 
              className="btn btn-default" 
              onClick={() => this.setState({showRejectProposalModal: false})}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={(id) => this.props.rejectCreditTransfer(this.props.data.id)}
            >
              Reject Proposal
            </button>
          </Modal.Footer>
        </Modal>
        <TransactionHistory />
      </div>
    );
  }
}

export default connect (
  state => ({
    data: state.rootReducer[ReducerTypes.GET_CREDIT_TRANSFER].data,
    fuelSuppliers: state.rootReducer[ReducerTypes.GET_FUEL_SUPPLIERS].data,
  }),
  dispatch => ({
    getCreditTransfer: (id) => {
      dispatch(getCreditTransfer(id));
    },
    getCreditTransferReset: () => {
      dispatch(getCreditTransferReset());
    },
    approveCreditTransfer: (id) => {
      dispatch(approveCreditTransfer(id));
    },
    rejectCreditTransfer: (id) => {
      dispatch(rejectCreditTransfer(id));
    },
    rescindProposal: (id) => {
      dispatch(rescindProposal(id));
    },
    getFuelSuppliers: () => {
      dispatch(getFuelSuppliers());
    }
  })
)(CreditTransferNew)
