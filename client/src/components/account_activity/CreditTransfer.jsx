import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import * as Values from '../../constants/values.jsx';
import { Modal } from 'react-bootstrap';
import { 
  getCreditTransfer,
  getCreditTransferReset,
  approveCreditTransfer,
  rejectCreditTransfer,
  rescindProposal } from '../../actions/accountActivityActions.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';

class CreditTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalType: '',
      showRescindCreditTransferModal: false,
      showApproveCreditTransferModal: false,
      showRejectProposalModal: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getCreditTransfer(this.props.match.params.id);
    }
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
        <h1>Credit Transfer {this.props.data.respondent && "Sell to " + this.props.data.respondent + " Proposed " + this.props.data.trade_effective_date}</h1>
        { this.props.data.status === Values.STATUS_DRAFT && 
          <button type="button" className="btn btn-danger">Delete Credit Transfer</button>
        }
        { this.props.data.status === Values.STATUS_PROPOSED && 
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={() => this.setState({showRescindCreditTransferModal: true})}
          >
          Rescind Credit Transfer
          </button>
        }
        { this.props.data.status === Values.STATUS_APPROVED && 
          <button type="button" className="btn btn-danger">Rescind Credit Transfer</button>
        }
        <div className="credit-transfer-progress-bar">
          <div className="arrow-steps clearfix">
            <div className={this.props.data.status === "Proposed" ? "step current" : "step"}><span>Proposed</span></div>
            <div className={this.props.data.status === "Accepted" ? "step current" : "step"}><span>Accepted</span></div>
            <div className={this.props.data.status === "Approved" ? "step current" : "step"}><span>Approved</span></div>
            <div className={this.props.data.status === "Complete" ? "step current" : "step"}><span>Complete</span></div>
          </div>
        </div>
        <div className="credit-transfer-details">
          { (this.props.data.initiator || !this.props.match.params.id) &&
            <form className="form-inline" onSubmit={(event) => this.handleSubmit(event)}>
              <div className="main-form">
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="initiator" 
                    name="initiator"
                    defaultValue={this.props.data.initiator}
                    ref={(input) => this.initiator = input} />
                </div>
                <span>proposes to </span>
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
                    defaultValue={this.props.data.number_of_credits}
                    ref={(input) => this.numberOfCredits = input} />
                </div>
                <span>{this.state.proposalType === "Buy" ? "credits from" : "credits to"}</span>
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="respondent" 
                    name="respondent"
                    defaultValue={this.props.data.respondent}
                    ref={(input) => this.respondent = input} />
                </div>
                <span>for </span>
                <div className="form-group">
                  <input 
                    type="number" 
                    className="form-control" 
                    id="value-per-credit" 
                    name="valuePerCredit"
                    defaultValue={this.props.data.fair_market_value_per_credit}
                    ref={(input) => this.valuePerCredit = input} />
                </div>
                <span>per credit for a total value of $</span>
                <span>{
                  this.props.data.fair_market_value_per_credit * this.props.data.number_of_credits
                }</span>
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
              { (this.props.data.status === Values.STATUS_NEW || this.props.data.status === Values.STATUS_DRAFT) && 
                <div>
                  <button type="button" className="btn btn-default">Cancel</button>
                  <button type="button" className="btn btn-default">Save Draft</button>
                  <button type="button" className="btn btn-primary">Propose</button>
                </div>
              }
              { this.props.data.status === Values.STATUS_PROPOSED && 
                <div>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => this.setState({showRejectProposalModal: true})}
                  >
                    Reject
                  </button>
                  <button type="button" className="btn btn-primary">Accept</button>
                </div>
              }
              { (this.props.data.status === Values.STATUS_ACCEPTED || this.props.data.status === Values.STATUS_RECOMMENDED) && 
                <div>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => this.setState({showRejectProposalModal: true})}
                  >
                    Reject
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => this.setState({showApproveCreditTransferModal: true})}
                  >
                    Approve
                  </button>
                </div>
              }
            </form>
          }
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
      </div>
    );
  }
}

export default connect (
  state => ({
    data: state.rootReducer[ReducerTypes.GET_CREDIT_TRANSFER].data
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
    }
  })
)(CreditTransfer)
