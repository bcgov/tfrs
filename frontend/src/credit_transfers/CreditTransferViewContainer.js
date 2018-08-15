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
import CreditTransferUtilityFunctions from './CreditTransferUtilityFunctions';

import {
  addCommentToCreditTransfer,
  updateCommentOnCreditTransfer,
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
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values';
import toastr from '../utils/toastr';

class CreditTransferViewContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      fields: {
        terms: []
      },
      isCommenting: false,
      isCreatingPrivilegedComment: false,
      hasCommented: false
    };

    this._addComment = this._addComment.bind(this);
    this._addToFields = this._addToFields.bind(this);
    this._cancelComment = this._cancelComment.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
    this._modalAccept = this._modalAccept.bind(this);
    this._modalDecline = this._modalDecline.bind(this);
    this._modalDelete = this._modalDelete.bind(this);
    this._modalNotRecommend = this._modalNotRecommend.bind(this);
    this._modalPullBack = this._modalPullBack.bind(this);
    this._modalRefuse = this._modalRefuse.bind(this);
    this._modalRescind = this._modalRescind.bind(this);
    this._modalReturn = this._modalReturn.bind(this);
    this._modalSubmit = this._modalSubmit.bind(this);
    this._saveComment = this._saveComment.bind(this);
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
    this.props.invalidateCreditTransfer();
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
      history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id));
      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.approved.id, this.props.item);
    });
  }

  _buildPVRContent (availableActions) {
    const { item } = this.props;
    const buttonActions = [];
    const content = [];

    if (availableActions.includes(Lang.BTN_SAVE_DRAFT)) {
      buttonActions.push(Lang.BTN_DELETE_DRAFT);
      buttonActions.push(Lang.BTN_EDIT_PVR_DRAFT);

      content.push(this._modalDelete(item));
    }

    if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
      buttonActions.push(Lang.BTN_PULL_BACK);
      content.push(this._modalPullBack());
    }

    if (availableActions.includes(Lang.BTN_RECOMMEND_FOR_DECISION)) {
      buttonActions.push(Lang.BTN_RECOMMEND_FOR_DECISION);

      content.push(this._modalRecommend(item));
    }

    if (availableActions.includes(Lang.BTN_DECLINE_FOR_APPROVAL)) {
      buttonActions.push(Lang.BTN_RETURN_TO_DRAFT);
      buttonActions.push(Lang.BTN_DECLINE_FOR_APPROVAL);

      content.push(this._modalReturn());
      content.push(this._modalDecline(item));
    }

    if (availableActions.includes(Lang.BTN_APPROVE)) {
      buttonActions.push(Lang.BTN_APPROVE);

      content.push(this._modalApprove(item));
    }

    return {
      buttonActions,
      content
    };
  }

  _buildTransferContent (availableActions) {
    const { item, loggedInUser } = this.props;
    const buttonActions = [];
    const content = [];

    if (item.status.id === CREDIT_TRANSFER_STATUS.draft.id) {
      buttonActions.push(Lang.BTN_SIGN_1_2);

      content.push(this._modalSubmit(item));
    }

    if (item.respondent.id === loggedInUser.organization.id) {
      if (item.status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
        buttonActions.push(Lang.BTN_SIGN_2_2);
        content.push(this._modalAccept());
      }

      if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
        buttonActions.push(Lang.BTN_RESCIND);
        content.push(this._modalRescind());
      }

      if (availableActions.includes(Lang.BTN_REFUSE)) {
        buttonActions.push(Lang.BTN_REFUSE);
        content.push(this._modalRefuse());
      }
    } else if (item.initiator.id === loggedInUser.organization.id) {
      if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
        buttonActions.push(Lang.BTN_RESCIND);
        content.push(this._modalRescind());
      }
    }

    if (availableActions.includes(Lang.BTN_SAVE_DRAFT)) {
      buttonActions.push(Lang.BTN_DELETE_DRAFT);
      buttonActions.push(Lang.BTN_EDIT_DRAFT);

      content.push(this._modalDelete(item));
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

    return {
      buttonActions,
      content
    };
  }

  _changeStatus (status) {
    const { item } = this.props;

    // Update the Status only
    const data = {
      initiator: item.initiator.id,
      fairMarketValuePerCredit: item.fairMarketValuePerCredit,
      isRescinded: item.isRescinded,
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
      history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id));
      toastr.creditTransactionSuccess(status.id, item);
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
    const { item } = this.props;

    this.props.deleteCreditTransfer(id).then(() => {
      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);
      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.deleted.id, item);
    });
  }

  _saveComment (comment) {
    const { item } = this.props;

    // API data structure
    const data = {
      credit_trade: item.id,
      comment: comment.comment,
      privilegedAccess: comment.privilegedAccess
    };

    switch (comment.id) {
      case null:
        this.props.addCommentToCreditTransfer(data).then(() => {
          this.props.invalidateCreditTransfer(this.props.item);
          this.props.getCreditTransferIfNeeded(this.props.item.id);
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          });
        }, () => {
        // Failed to update
        });
        break;
      default:
        // we are saving a pre-existing comment
        this.props.updateCommentOnCreditTransfer(comment.id, data).then(() => {
          this.props.invalidateCreditTransfer(this.props.item);
          this.props.getCreditTransferIfNeeded(this.props.item.id);
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          });
        }, () => {
          // Failed to update
        });
    }
  }

  _addComment (privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    });
  }

  _cancelComment () {
    this.setState({
      isCommenting: false,
      isCreatingPrivilegedComment: false
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
        Are you sure you want to sign and send this Credit Transfer
        Proposal to the Government of British Columbia?
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
        Are you sure you want to approve this credit
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' transfer proposal' : ' transaction'}?
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
        canBypassExtraConfirm
        extraConfirmText="You have not provided a comment explaining why you to decline to approve
         this credit transfer proposal"
        showExtraConfirm={!this.state.hasCommented}
        extraConfirmType="warning"
      >
        Are you sure you want to decline to approve this credit
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' transfer proposal' : ' transaction'}?
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

  _modalNotRecommend (item) {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.notRecommended);
        }}
        canBypassExtraConfirm={false}
        extraConfirmText="You must provide an explanatory comment if you are not recommending
          to approve this transfer proposal"
        showExtraConfirm={!this.state.hasCommented}
        extraConfirmType="error"
        id="confirmNotRecommend"
        key="confirmNotRecommend"
      >
        Are you sure you want to not recommend approval of this credit
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' transfer proposal' : ' transaction'}?
      </Modal>
    );
  }

  _modalPullBack () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.draft);
        }}
        id="confirmPullBack"
        key="confirmPullBack"
      >
        Are you sure you want to pull this transfer back?
      </Modal>
    );
  }

  _modalRecommend (item) {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.recommendedForDecision);
        }}
        id="confirmRecommend"
        key="confirmRecommend"
      >
        Are you sure you want to recommend approval of this credit
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' transfer proposal' : ' transaction'}?
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
          this._rescind();
        }}
        id="confirmRescind"
        key="confirmRescind"
      >
        Are you sure you want to rescind this transfer?
      </Modal>
    );
  }

  _modalReturn () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.draft);
        }}
        id="confirmReturn"
        key="confirmReturn"
      >
        Are you sure you want to send this transfer back to the analyst?
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

  _rescind () {
    // Change the rescinded flag only
    const { item } = this.props;

    // Update the Status only
    const data = {
      initiator: item.initiator.id,
      fairMarketValuePerCredit: item.fairMarketValuePerCredit,
      isRescinded: true,
      note: item.note,
      numberOfCredits: item.numberOfCredits,
      respondent: item.respondent.id,
      status: item.status.id,
      tradeEffectiveDate: null,
      type: item.type.id
    };

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.LIST);

      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.rescinded.id, item);
    }, () => {
      // Failed to update
    });
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
    let buttonActions = [];
    let content = [];

    if (!isFetching && item.actions && !item.isRescinded) {
      // TODO: Add util function to return appropriate actions
      availableActions = item.actions.map(action => (
        action.action
      ));

      if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].includes(item.type.id)) {
        ({ buttonActions, content } = this._buildTransferContent(availableActions));
      } else {
        ({ buttonActions, content } = this._buildPVRContent(availableActions));
      }
    }

    content.push(<CreditTransferDetails
      addToFields={this._addToFields}
      buttonActions={buttonActions}
      changeStatus={this._changeStatus}
      compliancePeriod={item.compliancePeriod}
      creditsFrom={item.creditsFrom}
      creditsTo={item.creditsTo}
      errors={this.props.errors}
      fairMarketValuePerCredit={item.fairMarketValuePerCredit}
      fields={this.state.fields}
      history={item.history}
      id={item.id}
      isFetching={isFetching}
      isRescinded={item.isRescinded}
      key="creditTransferDetails"
      loggedInUser={loggedInUser}
      note={item.note}
      numberOfCredits={item.numberOfCredits}
      rescinded={item.rescinded}
      signatures={item.signatures}
      status={item.status}
      toggleCheck={this._toggleCheck}
      totalValue={item.totalValue}
      tradeEffectiveDate={item.tradeEffectiveDate}
      tradeType={item.type}
      comments={item.comments}
      canComment={CreditTransferUtilityFunctions
        .canComment(this.props.loggedInUser, this.props.item)}
      addComment={this._addComment}
      cancelComment={this._cancelComment}
      saveComment={this._saveComment}
      isCommenting={this.state.isCommenting}
      isCreatingPrivilegedComment={this.state.isCreatingPrivilegedComment}
      hasCommented={this.state.hasCommented}
      canCreatePrivilegedComment={
        CreditTransferUtilityFunctions.canCreatePrivilegedComment(
          this.props.loggedInUser,
          this.props.item
        )
      }
    />);

    return content;
  }
}

CreditTransferViewContainer.defaultProps = {
  errors: {},
  item: {}
};

CreditTransferViewContainer.propTypes = {
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  approveCreditTransfer: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  getCreditTransferIfNeeded: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    actions: PropTypes.arrayOf(PropTypes.shape({})),
    commentActions: PropTypes.arrayOf(PropTypes.string),
    creditsFrom: PropTypes.shape({}),
    creditsTo: PropTypes.shape({}),
    status: PropTypes.shape({}),
    fairMarketValuePerCredit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    history: PropTypes.arrayOf(PropTypes.shape({
      status: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string
      }),
      user: PropTypes.shape({
        displayName: PropTypes.string,
        firstName: PropTypes.string,
        id: PropTypes.number,
        lastName: PropTypes.string
      })
    })),
    id: PropTypes.number,
    isRescinded: PropTypes.bool,
    numberOfCredits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    rescinded: PropTypes.bool,
    signatures: PropTypes.arrayOf(PropTypes.shape({
      displayName: PropTypes.string,
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
      organization: PropTypes.shape()
    })),
    totalValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
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
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  updateCommentOnCreditTransfer: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
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
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  updateCommentOnCreditTransfer: bindActionCreators(updateCommentOnCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferViewContainer);
