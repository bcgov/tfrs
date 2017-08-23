import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes.jsx';
import * as Values from '../../constants/values.jsx';
import { 
  plainEnglishPhrase, 
  getCreditTransferTitle,
  getCreditTradeInitiator } from '../../utils/functions.jsx';
import { Modal } from 'react-bootstrap';
import { 
  getCreditTransfer,
  getCreditTransferReset,
  updateCreditTransfer,
  deleteCreditTransfer,
  approveCreditTransfer,
  rejectCreditTransfer } from '../../actions/accountActivityActions.jsx';
import { getFuelSuppliers } from '../../actions/fuelSuppliersActions.jsx';
import { plainEnglishSentence } from '../../utils/functions.jsx';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import TransactionHistory from './TransactionHistory.jsx';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation.jsx';

class CreditTransfer extends Component {
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
    this.props.getCreditTransfer(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.data && this.props.data && this.props.data.fairMarketValuePerCredit && this.props.data.numberOfCredits) {
      this.setState({
        valuePerCredit: this.props.data.fairMarketValuePerCredit,
        numberOfCredits: this.props.data.numberOfCredits
      })
    }
    if (prevProps.match.params.id != this.props.match.params.id) {
      this.props.getFuelSuppliers();
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
    const initiatorFK = this.props.fuelSuppliers[0].id;
    const creditTradeTypeFK = this.creditTradeTypeFK.value;
    const numberOfCredits = this.numberOfCredits.value;
    const respondentFK = this.respondent.value;
    const valuePerCredit = this.valuePerCredit.value;
    const creditTradeStatusFK = Values.STATUS_PROPOSED
    const note = this.note.value;
    const id = this.props.match.params.id;
    const data = {
      id: id,
      initiatorFK: initiatorFK,
      numberOfCredits: numberOfCredits,
      respondentFK: respondentFK,
      valuePerCredit: valuePerCredit,
      note: note,
      creditTradeStatusFK: creditTradeStatusFK,
      creditTradeTypeFK: creditTradeTypeFK
    }
    this.props.updateCreditTransfer(data);
  }
  
  render() {
    return (
      <div className="credit-transfer">
        { this.props.data && this.props.data.id && 
        <div>
          {this.props.data.id && getCreditTransferTitle(this.props.data)}
          { this.props.data.creditTradeStatusFK === Values.STATUS_DRAFT && 
            <button 
              type="button" 
              className="btn btn-danger">
              Delete Credit Transfer
            </button>
          }
          { this.props.data.creditTradeStatusFK === Values.STATUS_PROPOSED && 
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={() => this.setState({showRescindCreditTransferModal: true})}
            >
            Rescind Credit Transfer
            </button>
          }
          { this.props.data.creditTradeStatusFK === Values.STATUS_APPROVED && 
            <button type="button" className="btn btn-danger">Rescind Credit Transfer</button>
          }
          <div className="credit-transfer-progress-bar">
            <div className="arrow-steps clearfix">
              <div className={this.props.data.creditTradeStatusFK == Values.PROPOSED ? "step current" : "step"}><span>Proposed</span></div>
              <div className={this.props.data.creditTradeStatusFK === Values.ACCEPTED ? "step current" : "step"}><span>Accepted</span></div>
              <div className={this.props.data.creditTradeStatusFK === Values.APPROVED ? "step current" : "step"}><span>Approved</span></div>
              <div className={this.props.data.creditTradeStatusFK === Values.COMPLETED ? "step current" : "step"}><span>Complete</span></div>
            </div>
          </div>
          <div className="credit-transfer-details">
            <form className="form-inline" onSubmit={(event) => this.handleSubmit(event)}>
              { this.props.data.creditTradeStatusFK == Values.STATUS_DRAFT ? 
                <div className="main-form">
                  <span>{getCreditTradeInitiator(this.props.data.initiatorFK)} proposes to </span>
                  <div className="form-group">
                    <select 
                      className="form-control" 
                      id="creditTradeTypeFK" 
                      name="creditTradeTypeFK"
                      ref={(input) => this.creditTradeTypeFK = input}
                      onChange={(event) => this.handleInputChange(event)}>
                      <option value="1">Sell</option>
                      <option value="2">Buy</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      id="number-of-credits" 
                      name="numberOfCredits"
                      defaultValue={this.props.data.numberOfCredits}
                      onChange={(event) => this.handleInputChange(event)}
                      ref={(input) => this.numberOfCredits = input} />
                  </div>
                  <span>{this.state.proposalType === "Buy" ? "credits from " : "credits to "}</span>
                  <div className="form-group">
                    <select 
                      className="form-control" 
                      id="respondent" 
                      name="respondent"
                      ref={(input) => this.respondent = input}
                      defaultValue={this.props.data && this.props.data.respondentFK}
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
                      defaultValue={this.props.data.fairMarketValuePerCredit}
                      ref={(input) => this.valuePerCredit = input} />
                  </div>
                  <span>per credit for a total value of $</span>
                  <span>{ this.state.valuePerCredit * this.state.numberOfCredits }</span>
                  <span> effective on Director's Approval</span>
                </div>
                :
                <div className="main-form">
                  { this.props.data.id &&
                  <div>{plainEnglishPhrase(this.props.data)}</div>
                  }
                </div>
                }
                <CreditTransferVisualRepresentation data={this.props.data} />
              <div className="form-group note">
                <label htmlFor="comment">Note:</label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  id="note"
                  ref={(input) => this.note = input}>
                </textarea>
              </div>
              { (this.props.data.creditTradeStatusFK === Values.STATUS_NEW || this.props.data.creditTradeStatusFK=== Values.STATUS_DRAFT) && 
                <div className="btn-container">
                  <button type="button" className="btn btn-default">Cancel</button>
                  <button type="button" className="btn btn-default">Save Draft</button>
                  <button type="submit" className="btn btn-primary">Propose</button>
                </div>
              }
              { this.props.data.creditTradeStatusFK === Values.STATUS_PROPOSED && 
                <div className="btn-container">
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
              { (this.props.data.creditTradeStatusFK=== Values.STATUS_ACCEPTED || this.props.data.creditTradeStatusFK === Values.STATUS_RECOMMENDED) && 
                <div className="btn-container">
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
                onClick={(id) => this.props.deleteCreditTransfer(this.props.data.id)}
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
        }
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
    updateCreditTransfer: (data) => {
      dispatch(updateCreditTransfer(data));
    },
    approveCreditTransfer: (id) => {
      dispatch(approveCreditTransfer(id));
    },
    rejectCreditTransfer: (id) => {
      dispatch(rejectCreditTransfer(id));
    },
    deleteCreditTransfer: (id) => {
      dispatch(deleteCreditTransfer(id));
    },
    getFuelSuppliers: () => {
      dispatch(getFuelSuppliers());
    }
  })
)(CreditTransfer)
