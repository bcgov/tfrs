/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreditTransferDetails from './components/CreditTransferDetails';
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer';

import {
  approveCreditTransfer,
  deleteCreditTransfer,
  getCreditTransferIfNeeded,
  invalidateCreditTransfer,
  updateCreditTransfer
} from '../actions/creditTransfersActions';
import {
  addSigningAuthorityConfirmation,
  prepareSigningAuthorityConfirmations
} from '../actions/signingAuthorityConfirmationsActions';
import { getLoggedInUser } from '../actions/userActions';
import history from '../app/History';
import Modal from '../app/components/Modal';
import * as Lang from '../constants/langEnUs';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../constants/values';

class CreditTransferViewContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        terms: []
      }
    };

    this._addToFields = this._addToFields.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
    this._modalAccept = this._modalAccept.bind(this);
    this._modalDelete = this._modalDelete.bind(this);
    this._modalRefuse = this._modalRefuse.bind(this);
    this._modalRescind = this._modalRescind.bind(this);
    this._modalSubmit = this._modalSubmit.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.loadData(this.props.match.params.id);
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  loadData (id) {
    this.props.getCreditTransferIfNeeded(id);
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };
    fieldState.terms.push(value);

    this.setState({
      fields: fieldState
    });
  }

  _approveCreditTransfer (id) {
    this.props.approveCreditTransfer(id).then(() => {
      history.push(CREDIT_TRANSACTIONS.LIST);
    });
  }

  _changeStatus (status) {
    const { item } = this.props;

    // API data structure
    const data = {
      initiator: item.initiator.id,
      fairMarketValuePerCredit: item.fairMarketValuePerCredit,
      note: item.note,
      numberOfCredits: item.numberOfCredits,
      respondent: item.respondent.id,
      status: status.id,
      tradeEffectiveDate: null,
      type: item.type.id
    };

    // Update credit transfer (status only)

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);
    }, () => {
      // Failed to update
    });

    // if it's being proposed or accepted capture the acceptance of the terms
    if ([
      CREDIT_TRANSFER_STATUS.accepted.id,
      CREDIT_TRANSFER_STATUS.proposed.id
    ].includes(status.id)) {
      const assertions = this.props.prepareSigningAuthorityConfirmations(
        id,
        this.state.fields.terms
      );

      this.props.addSigningAuthorityConfirmation(assertions);
    }
  }

  _deleteCreditTransfer (id) {
    this.props.deleteCreditTransfer(id).then(() => {
      history.push(CREDIT_TRANSACTIONS.LIST);
    });
  }

  _modalAccept () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.accepted);
        }}
        id="confirmAccept"
        key="confirmAccept"
      >
        Are you sure you want to accept this transfer?
      </Modal>
    );
  }

  _modalApprove (item) {
    return (
      <Modal
        handleSubmit={() => this._approveCreditTransfer(item.id)}
        id="confirmApprove"
        key="confirmApprove"
      >
        Are you sure you want to accept this transfer?
      </Modal>
    );
  }

  _modalDecline (item) {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.declinedForApproval);
        }}
        id="confirmDecline"
        key="confirmDecline"
      >
        Are you sure you want to decline this transfer for approval?
      </Modal>
    );
  }

  _modalDelete (item) {
    return (
      <Modal
        handleSubmit={() => this._deleteCreditTransfer(item.id)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    );
  }

  _modalNotRecommend () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.notRecommended);
        }}
        id="confirmNotRecommend"
        key="confirmNotRecommend"
      >
        Are you sure you want to not recommend approval of this credit transfer proposal?
      </Modal>
    );
  }

  _modalRecommend () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.recommendedForDecision);
        }}
        id="confirmRecommend"
        key="confirmRecommend"
      >
        Are you sure you want to recommend approval of this credit transfer proposal?
      </Modal>
    );
  }

  _modalRefuse () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.refused);
        }}
        id="confirmRefuse"
        key="confirmRefuse"
      >
        Are you sure you want to refuse this transfer?
      </Modal>
    );
  }

  _modalRescind () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.rescinded);
        }}
        id="confirmRescind"
        key="confirmRescind"
      >
        Are you sure you want to rescind this transfer?
      </Modal>
    );
  }

  _modalSubmit (item) {
    return (
      <ModalSubmitCreditTransfer
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.proposed);
        }}
        item={item}
        key="confirmSubmit"
      />
    );
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.terms.findIndex(term => term.id === key);
    fieldState.terms[index].value = !fieldState.terms[index].value;

    this.setState({
      fields: fieldState
    });
  }

  render () {
    const { isFetching, item, loggedInUser } = this.props;
    let availableActions = [];
    const buttonActions = [];
    const content = [(
      <CreditTransferDetails
        addToFields={this._addToFields}
        buttonActions={buttonActions}
        changeStatus={this._changeStatus}
        compliancePeriod={item.compliancePeriod}
        creditsFrom={item.creditsFrom}
        creditsTo={item.creditsTo}
        fairMarketValuePerCredit={item.fairMarketValuePerCredit}
        fields={this.state.fields}
        id={item.id}
        isFetching={isFetching}
        key="creditTransferDetails"
        note={item.note}
        numberOfCredits={item.numberOfCredits}
        status={item.status}
        toggleCheck={this._toggleCheck}
        totalValue={item.totalValue}
        tradeEffectiveDate={item.tradeEffectiveDate}
        tradeType={item.type}
      />
    )];

    if (!isFetching && item.actions) {
      // TODO: Add util function to return appropriate actions
      availableActions = item.actions.map(action => (
        action.action
      ));

      if (item.respondent.id === loggedInUser.organization.id) {
        if (availableActions.includes(Lang.BTN_ACCEPT)) {
          buttonActions.push(Lang.BTN_SIGN_2_2);
          content.push(this._modalAccept());
        }

        if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
          if (item.status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
            buttonActions.push(Lang.BTN_REFUSE);
            content.push(this._modalRefuse());
          } else {
            buttonActions.push(Lang.BTN_RESCIND);
            content.push(this._modalRescind());
          }
        }
      } else if (item.initiator.id === loggedInUser.organization.id) {
        if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
          buttonActions.push(Lang.BTN_RESCIND);
        }

        content.push(this._modalRescind());
      }

      if (availableActions.includes(Lang.BTN_SAVE_DRAFT)) {
        buttonActions.push(Lang.BTN_DELETE_DRAFT);
        buttonActions.push(Lang.BTN_EDIT_DRAFT);

        content.push(this._modalDelete(item));
      }

      if (availableActions.includes(Lang.BTN_PROPOSE)) {
        buttonActions.push(Lang.BTN_SIGN_1_2);

        content.push(this._modalSubmit(item));
      }

      if (availableActions.includes(Lang.BTN_RECOMMEND_FOR_DECISION)) {
        buttonActions.push(Lang.BTN_NOT_RECOMMENDED_FOR_DECISION);
        buttonActions.push(Lang.BTN_RECOMMEND_FOR_DECISION);

        content.push(this._modalRecommend(item));
        content.push(this._modalNotRecommend(item));
      }

      if (availableActions.includes(Lang.BTN_DECLINE_FOR_APPROVAL)) {
        buttonActions.push(Lang.BTN_DECLINE_FOR_APPROVAL);

        content.push(this._modalDecline(item));
      }

      if (availableActions.includes(Lang.BTN_APPROVE)) {
        buttonActions.push(Lang.BTN_APPROVE);

        content.push(this._modalApprove(item));
      }
    }

    return content;
  }
}

CreditTransferViewContainer.defaultProps = {
  item: {}
};

CreditTransferViewContainer.propTypes = {
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  approveCreditTransfer: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  getCreditTransferIfNeeded: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    creditsFrom: PropTypes.shape({}),
    creditsTo: PropTypes.shape({}),
    fairMarketValuePerCredit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    numberOfCredits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    totalValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    actions: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  prepareSigningAuthorityConfirmations: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addSigningAuthorityConfirmation: bindActionCreators(addSigningAuthorityConfirmation, dispatch),
  approveCreditTransfer: bindActionCreators(approveCreditTransfer, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  getCreditTransferIfNeeded: bindActionCreators(getCreditTransferIfNeeded, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  prepareSigningAuthorityConfirmations: (creditTradeId, terms) =>
    prepareSigningAuthorityConfirmations(creditTradeId, terms),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferViewContainer);
