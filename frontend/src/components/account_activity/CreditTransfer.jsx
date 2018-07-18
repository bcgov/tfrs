import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ReducerTypes from '../../constants/reducerTypes';
import * as Values from '../../constants/values';
import * as Routes from '../../constants/routes';
import { 
  plainEnglishPhrase, 
  getCreditTransferTitle } from '../../utils/functions';
import { Modal } from 'react-bootstrap';
import { 
  getCreditTransfer,
  getCreditTransferHistory,
  getCreditTransferReset,
  updateCreditTransfer,
  deleteCreditTransfer } from '../../actions/accountActivityActions';
import { getOrganizations } from '../../actions/organizationActions';
import { plainEnglishSentence } from '../../utils/functions';
import { BootstrapTable, TableHeaderColumn, ButtonGroup } from 'react-bootstrap-table';
import TransactionHistory from './TransactionHistory';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';

class CreditTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposalType: '',
      fairMarketValuePerCredit: '',
      numberOfCredits: '',
      showRescindCreditTransferModal: false,
      showDeleteCreditTransferModal: false,
      showApproveCreditTransferModal: false,
      showAcceptCreditTransferModal: false,
      showRejectProposalModal: false,
    };
  }

  componentDidMount() {
    this.props.getOrganizations();
    this.props.getCreditTransfer(this.props.match.params.id);
    this.props.getCreditTransferHistory(this.props.match.params.id);

    console.log("data is" , this.props.data)

    this.setState({
        fairMarketValuePerCredit: this.props.data.fairMarketValuePerCredit,
        numberOfCredits: this.props.data.numberOfCredits
      })
  }

  componentDidUpdate(prevProps, prevState) {

    console.log("updated data is" , this.props.data)
    console.log("prevprops", prevProps.data)
    if (!prevProps.data && this.props.data && this.props.data.fairMarketValuePerCredit && this.props.data.numberOfCredits) {
      
      this.setState({
        fairMarketValuePerCredit: this.props.data.fairMarketValuePerCredit,
        numberOfCredits: this.props.data.numberOfCredits
      })
    }
    if (prevProps.match.params.id != this.props.match.params.id) {
      // this.props.getOrganizations();
      this.props.getCreditTransfer(this.props.match.params.id);
      this.props.getCreditTransferHistory(this.props.match.params.id);
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

  handleUpdate(status) {
    const data = {
      id: this.props.data.id,
      initiator: this.props.data.initiator,
      numberOfCredits: this.props.data.numberOfCredits,
      respondent: this.props.data.respondent,
      fairMarketValuePerCredit: this.props.data.fairMarketValuePerCredit,
      status: status,
      type: this.props.data.type,
      tradeEffectiveDate: this.props.data.trade_effective_date,
    }
    this.props.updateCreditTransfer(data);
  }

  handleSubmit(event, status) {
    event.preventDefault();
    // const initiator = this.props.organizations[0].id;
    const initiatorId = this.props.data.initiator.id;
    const typeId = this.typeId.value;
    const numberOfCredits = this.numberOfCredits.value;
    const respondentId = this.respondentId.value;
    const fairMarketValuePerCredit = this.fairMarketValuePerCredit.value;
    // const status = status;
    const id = this.props.match.params.id;
    const data = {
      id: id,
      initiator: initiatorId,
      numberOfCredits: numberOfCredits,
      respondent: respondentId,
      fairMarketValuePerCredit: fairMarketValuePerCredit,
      status: status,
      type: typeId
    }
    this.props.updateCreditTransfer(data);
  }
  
  render() {
    return (
      <div className="credit-transfer">
        { this.props.data && this.props.data.id && 
        <div>
          {this.props.data.id && getCreditTransferTitle(this.props.data)}
          { this.props.data.status.status == "Draft" && 
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={() => this.setState({showDeleteCreditTransferModal: true})}>
              Delete Credit Transfer
            </button>
          }
          { (this.props.data.status.id === Values.STATUS_PROPOSED || this.props.data.status.id === Values.STATUS_APPROVED) && 
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={() => this.setState({showRescindCreditTransferModal: true})}>
            Rescind Credit Transfer
            </button>
          }
          <div className="credit-transfer-progress-bar">
            <div className="arrow-steps clearfix">
              <div className={this.props.data.status.id == Values.STATUS_PROPOSED ? "step current" : "step"}><span>Proposed</span></div>
              <div className={this.props.data.status.id === Values.STATUS_ACCEPTED ? "step current" : "step"}><span>Accepted</span></div>
              <div className={this.props.data.status.id === Values.STATUS_APPROVED ? "step current" : "step"}><span>Approved</span></div>
              <div className={this.props.data.status.id === Values.STATUS_COMPLETED ? "step current" : "step"}><span>Complete</span></div>
            </div>
          </div>
          <div className="credit-transfer-details">
            <form className="form-inline" onSubmit={(event, status) => this.handleSubmit(event, Values.STATUS_PROPOSED)}>
              { this.props.data.status.status == "Draft" ? 
                <div className="main-form">
                  <span>{this.props.data.initiator.name} proposes to </span>
                  <div className="form-group">
                    <select 
                      className="form-control" 
                      id="credit-trade-type" 
                      name="credit_trade_type"
                      ref={(input) => this.typeId = input}
                      onChange={(event) => this.handleInputChange(event)}>
                      <option value="1" key="type_1">Sell</option>
                      <option value="2" key="type_2">Buy</option>
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
                      ref={(input) => this.respondentId = input}
                      defaultValue={this.props.data && this.props.data.respondent.id}
                      onChange={(event) => this.handleInputChange(event)}>
                      { this.props.organizations &&
                        this.props.organizations.map((organization) => (
                          <option value={organization.id} key={'organization_' + organization.id}>{organization.name}</option>
                      ))}
                    </select>
                  </div>
                  <span>for </span>
                  <div className="form-group">
                    <input 
                      type="number" 
                      className="form-control" 
                      id="fair-market-value-per-credit" 
                      name="fairMarketValuePerCredit"
                      onChange={(event) => this.handleInputChange(event)}
                      defaultValue={this.props.data.fairMarketValuePerCredit}
                      ref={(input) => this.fairMarketValuePerCredit = input} />
                  </div>
                  <span>per credit for a total value of {this.state.fairMarketValuePerCredit}$</span>
                  <span>{ this.state.fairMarketValuePerCredit * this.state.numberOfCredits }</span>
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
              { (this.props.data.status.id === Values.STATUS_NEW || this.props.data.status.status == 'Draft') && 
                <div className="btn-container">
                  <button 
                    type="button" 
                    className="btn btn-default"
                    onClick={() => this.props.history.push(Routes.ACCOUNT_ACTIVITY)}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-default"
                    onClick={(event, status) => this.handleSubmit(event, Values.STATUS_DRAFT)}>
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary">
                    Propose
                  </button>
                </div>
              }
              { this.props.data.status.id === Values.STATUS_PROPOSED && 
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
                    onClick={() => this.setState({showAcceptCreditTransferModal: true})}>
                    Accept
                  </button>
                </div>
              }
              { (this.props.data.status.id=== Values.STATUS_ACCEPTED || this.props.data.status.id === Values.STATUS_RECOMMENDED) && 
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
            className="new-organization-modal"
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
                onClick={(status) => this.handleUpdate(Values.STATUS_CANCELLED)}
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
            className="new-organization-modal"
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Approve Credit Transfer</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              Are you sure you want to approve this credit transfer?
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
                onClick={(status) => this.handleUpdate(Values.STATUS_APPROVED)}
              >
                Approve
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            container={this}
            show={this.state.showAcceptCreditTransferModal}
            onHide={() => this.setState({showAcceptCreditTransferModal: false})}
            aria-labelledby="contained-modal-title"
            className="new-organization-modal"
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Accept Credit Transfer</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              Are you sure you want to accept this credit transfer?
            </Modal.Body>
            <Modal.Footer>
              <button 
                type="button" 
                className="btn btn-default" 
                onClick={() => this.setState({showAcceptCreditTransferModal: false})}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={(status) => this.handleUpdate(Values.STATUS_ACCEPTED)}
              >
                Accept
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            container={this}
            show={this.state.showRejectProposalModal}
            onHide={() => this.setState({showRejectProposalModal: false})}
            aria-labelledby="contained-modal-title"
            className="new-organization-modal"
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Reject Credit Transfer</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              Are you sure you want to reject this credit transfer?
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
                onClick={(status) => this.handleUpdate(Values.STATUS_REJECTED)}
              >
                Reject Proposal
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            container={this}
            show={this.state.showDeleteCreditTransferModal}
            onHide={() => this.setState({showDeleteCreditTransferModal: false})}
            aria-labelledby="contained-modal-title"
            className="new-organization-modal"
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Delete Credit Transfer</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              Clicking "Delete Credit Transfer" will delete the credit transfer permanently?
            </Modal.Body>
            <Modal.Footer>
              <button 
                type="button" 
                className="btn btn-default"
                onClick={() => this.setState({showDeleteCreditTransferModal: false})}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={(id) => this.props.deleteCreditTransfer(this.props.match.params.id)}
              >
                Delete Credit Transfer
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
    organizations: state.rootReducer[ReducerTypes.GET_ORGANIZATIONS].data,
    creditTransferHistory: state.rootReducer[ReducerTypes.GET_CREDIT_TRANSFER_HISTORY].data,
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
    deleteCreditTransfer: (id) => {
      dispatch(deleteCreditTransfer(id));
    },
    getOrganizations: () => {
      dispatch(getOrganizations());
    },
    getCreditTransferHistory: (id) => {
      dispatch(getCreditTransferHistory(id));
    }
  })
)(CreditTransfer)
