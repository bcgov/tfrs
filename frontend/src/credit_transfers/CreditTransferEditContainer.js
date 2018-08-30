/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../app/components/Loading';
import Modal from '../app/components/Modal';
import CreditTransferForm from './components/CreditTransferForm';
import GovernmentTransferForm from './components/GovernmentTransferForm';
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer';

import {
  addCommentToCreditTransfer,
  deleteCreditTransfer,
  getCreditTransfer,
  invalidateCreditTransfer,
  updateCommentOnCreditTransfer,
  updateCreditTransfer
} from '../actions/creditTransfersActions';
import { getFuelSuppliers } from '../actions/organizationActions';
import { getLoggedInUser } from '../actions/userActions';
import {
  addSigningAuthorityConfirmation,
  prepareSigningAuthorityConfirmations
} from '../actions/signingAuthorityConfirmationsActions';
import history from '../app/History';
import * as Lang from '../constants/langEnUs';
import COMMENTS from '../constants/permissions/Comments';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values';
import toastr from '../utils/toastr';

class CreditTransferEditContainer extends Component {
  constructor (props) {
    super(props);

    if (props.loggedInUser.isGovernmentUser) {
      this.state = {
        fields: {
          comment: '',
          compliancePeriod: {},
          numberOfCredits: '',
          respondent: {},
          tradeType: {
            id: CREDIT_TRANSFER_TYPES.part3Award.id
          },
          zeroDollarReason: { id: null, name: '' }
        },
        isCommenting: false,
        isCreatingPrivilegedComment: false,
        hasCommented: false,
        submitted: false
      };
    } else {
      this.state = {
        creditsFrom: {},
        creditsTo: {},
        fields: {
          comment: '',
          fairMarketValuePerCredit: '',
          initiator: {},
          note: '',
          numberOfCredits: '',
          respondent: { id: 0, name: '' },
          terms: [],
          tradeType: {
            id: CREDIT_TRANSFER_TYPES.sell.id
          },
          zeroDollarReason: { id: null, name: '' }
        },
        submitted: false,
        totalValue: 0
      };
    }

    this._addComment = this._addComment.bind(this);
    this._addToFields = this._addToFields.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCommentChanged = this._handleCommentChanged.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.props.invalidateCreditTransfer();
    this.loadData(this.props.match.params.id);
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    this.loadPropsToFieldState(props);
  }

  loadData (id) {
    this.props.getCreditTransfer(id);
  }

  loadPropsToFieldState (props) {
    if (Object.keys(props.item).length > 0) {
      const { item } = props;

      if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) < 0) {
        this._setGovernmentTransferState(item);
      } else {
        this._setCreditTransferState(item);
      }
    }
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.match.params.id !== newProps.match.params.id) {
      this.loadData(newProps.match.params.id);
    }
  }

  _addComment (privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    });
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };

    const found = this.state.fields.terms.find(term => term.id === value.id);

    if (!found) {
      fieldState.terms.push(value);
    }

    this.setState({
      fields: fieldState
    });
  }

  _changeStatus (status) {
    this.changeObjectProp(status.id, 'tradeStatus');
  }

  _creditTransferSubmit (status) {
    // API data structure
    const data = {
      fairMarketValuePerCredit: parseFloat(this.state.fields.fairMarketValuePerCredit).toFixed(2),
      initiator: this.state.fields.initiator.id,
      note: this.state.fields.note,
      comment: this.state.fields.comment,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      tradeEffectiveDate: null,
      type: this.state.fields.tradeType.id,
      zeroReason: (this.state.fields.zeroDollarReason != null &&
        this.state.fields.zeroDollarReason.id) || null
    };

    if (data.fairMarketValuePerCredit > 0) {
      data.zeroReason = null;
    }

    const { id } = this.props.item;

    this.props.updateCreditTransfer(id, data).then((response) => {
      // if it's being proposed capture the acceptance of the terms
      if (status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
        const confirmations = this.props.prepareSigningAuthorityConfirmations(
          id,
          this.state.fields.terms
        );

        this.props.addSigningAuthorityConfirmation(confirmations);
      }

      this.props.invalidateCreditTransfer();
      history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id));
      toastr.creditTransactionSuccess(status.id, this.props.item);
    }, () => {
      // Failed to update
    });

    return false;
  }

  _deleteCreditTransfer (id) {
    this.props.deleteCreditTransfer(id).then(() => {
      history.push(CREDIT_TRANSACTIONS.LIST);
      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.deleted.id, this.props.item);
    });
  }

  _governmentTransferSubmit (status) {
    const { id } = this.props.item;
    const { comment } = this.state.fields;
    const { isCreatingPrivilegedComment } = this.state;

    // API data structure
    const data = {
      compliancePeriod: this.state.fields.compliancePeriod.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      type: this.state.fields.tradeType.id
    };

    this.props.updateCreditTransfer(id, data).then((response) => {
      this._saveComment(comment, isCreatingPrivilegedComment);

      history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id));
      toastr.creditTransactionSuccess(status.id, this.props.item);
    });

    return false;
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

    if (name === 'zeroDollarReason') {
      fieldState[name] = {
        id: parseInt(value, 10)
      };
      this.setState({
        fields: fieldState
      });
      return;
    }

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name);
    } else {
      fieldState[name] = value;
      this.setState({
        fields: fieldState
      }, () => this.computeTotalValue(name));
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault();

    this.setState({
      submitted: true
    });

    // Government Transfer Submit
    if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id]
      .indexOf(this.state.fields.tradeType.id) < 0) {
      this._governmentTransferSubmit(status);
    } else { // Credit Transfer Submit
      this._creditTransferSubmit(status);
    }

    return false;
  }

  _handleCommentChanged (comment) {
    const fieldState = { ...this.state.fields };

    fieldState.comment = comment;

    this.setState({
      fields: fieldState
    });
  }

  _renderCreditTransfer () {
    let availableActions = [];
    const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_SIGN_1_2];
    const { isFetching, item } = this.props;

    if (!isFetching && item.actions) {
      // TODO: Add util function to return appropriate actions
      availableActions = item.actions.map(action => (
        action.action
      ));

      if (availableActions.includes(Lang.BTN_SAVE_DRAFT)) {
        buttonActions.push(Lang.BTN_DELETE_DRAFT);
      }
    }

    return ([
      <CreditTransferForm
        addToFields={this._addToFields}
        buttonActions={buttonActions}
        changeStatus={this._changeStatus}
        creditsFrom={this.state.creditsFrom}
        creditsTo={this.state.creditsTo}
        zeroDollarReason={this.state.zeroDollarReason}
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        handleCommentChanged={this._handleCommentChanged}
        id={item.id}
        key="creditTransferForm"
        loggedInUser={this.props.loggedInUser}
        terms={this.state.terms}
        title="Edit Credit Transfer"
        toggleCheck={this._toggleCheck}
        totalValue={this.state.totalValue}
        tradeStatus={this.state.tradeStatus}
        comments={this.props.item.comments}
      />,
      <ModalSubmitCreditTransfer
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed);
        }}
        item={
          {
            creditsFrom: this.state.creditsFrom,
            creditsTo: this.state.creditsTo,
            fairMarketValuePerCredit: item.fairMarketValuePerCredit,
            numberOfCredits: item.numberOfCredits
          }
        }
        key="confirmSubmit"
      />,
      <Modal
        handleSubmit={() => this._deleteCreditTransfer(item.id)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    ]);
  }

  _renderGovernmentTransfer () {
    const buttonActions = [
      Lang.BTN_DELETE_DRAFT, Lang.BTN_SAVE_DRAFT, Lang.BTN_RECOMMEND_FOR_DECISION];

    const { item } = this.props;

    return ([
      <GovernmentTransferForm
        actions={buttonActions}
        addComment={this._addComment}
        canComment
        canCreatePrivilegedComment={this.props.loggedInUser.hasPermission(COMMENTS.EDIT_PRIVILEGED)}
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleCommentChanged={this._handleCommentChanged}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        hasCommented={this.state.hasCommented}
        isCommenting={this.state.isCommenting}
        isCreatingPrivilegedComment={this.state.isCreatingPrivilegedComment}
        key="creditTransferForm"
        title="Edit Credit Transaction"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.recommendedForDecision);
        }}
        id="confirmRecommend"
        key="confirmRecommend"
      >
        Are you sure you want to recommend approval of this credit transaction?
      </Modal>,
      <Modal
        handleSubmit={() => this._deleteCreditTransfer(item.id)}
        id="confirmDelete"
        key="confirmDelete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    ]);
  }

  _saveComment (comment, privileged = false) {
    const { item } = this.props;
    // API data structure
    const data = {
      creditTrade: item.id,
      comment,
      privilegedAccess: privileged
    };

    if (item.comments.length > 0) {
      // we only allow one comment per entry in the Historical Data Entry
      return this.props.updateCommentOnCreditTransfer(item.comments[0].id, data);
    }

    if (comment.length > 0) {
      return this.props.addCommentToCreditTransfer(data);
    }

    return false;
  }

  _setCreditTransferState (item) {
    if (!this.state.submitted) {
      const fieldState = {
        initiator: item.initiator,
        fairMarketValuePerCredit: item.fairMarketValuePerCredit,
        note: '',
        numberOfCredits: item.numberOfCredits.toString(),
        respondent: item.respondent,
        terms: this.state.fields.terms,
        tradeStatus: item.status,
        tradeType: item.type,
        zeroDollarReason: item.zeroReason
      };

      this.setState({
        fields: fieldState,
        creditsFrom: item.creditsFrom,
        creditsTo: item.creditsTo,
        totalValue: item.totalValue
      });
    }
  }

  _setGovernmentTransferState (item) {
    if (!this.state.submitted) {
      const fieldState = {
        comment: (item.comments.length > 0) ? item.comments[0].comment : '',
        compliancePeriod: item.compliancePeriod ? item.compliancePeriod : { id: 0 },
        numberOfCredits: item.numberOfCredits.toString(),
        respondent: item.respondent,
        tradeType: item.type,
        zeroDollarReason: item.zeroReason
      };

      if (item.comments.length > 0) {
        this.setState({
          isCreatingPrivilegedComment: item.comments[0].privilegedAccess
        });
      }

      this.setState({
        fields: fieldState
      });
    }
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.terms.findIndex(term => term.id === key);
    fieldState.terms[index].value = !fieldState.terms[index].value;

    this.setState({
      fields: fieldState
    });
  }

  /*
   * Helper functions
   */
  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields };

    if (name === 'respondent') {
      // Populate the dropdown
      const respondents = this.props.fuelSuppliers.filter(fuelSupplier => (fuelSupplier.id === id));

      fieldState.respondent = respondents.length === 1 ? respondents[0] : { id: 0 };
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ));
    } else if (name === 'tradeType') {
      fieldState[name] = { id: id || 0 };
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ));
    } else {
      fieldState[name] = { id: id || 0 };
      this.setState({
        fields: fieldState
      });
    }
  }

  changeFromTo (tradeType, initiator, respondent) {
    // Change the creditsFrom and creditsTo according to the trade type
    let creditsFrom = initiator;
    let creditsTo = respondent;
    if (tradeType.id === 2) {
      creditsFrom = respondent;
      creditsTo = initiator;
    }

    this.setState({ creditsFrom, creditsTo });
  }

  computeTotalValue (name) {
    // Compute the total value when the fields change
    if (['numberOfCredits', 'fairMarketValuePerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.fairMarketValuePerCredit
      });
    }
  }

  render () {
    const { item } = this.props;

    if (Object.keys(item).length === 0) {
      return <Loading />;
    }

    if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) < 0) {
      return this._renderGovernmentTransfer();
    }

    return this._renderCreditTransfer();
  }
}

CreditTransferEditContainer.defaultProps = {
  errors: {}
};

CreditTransferEditContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getCreditTransfer: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  isFetching: PropTypes.bool.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    creditsFrom: PropTypes.shape({}),
    creditsTo: PropTypes.shape({}),
    fairMarketValuePerCredit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    zeroReason: PropTypes.shape({
      id: PropTypes.number,
      reason: PropTypes.string
    }),
    numberOfCredits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    totalValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      comment: PropTypes.string
    })),
    actions: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
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
  updateCommentOnCreditTransfer: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  addSigningAuthorityConfirmation: bindActionCreators(addSigningAuthorityConfirmation, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  getCreditTransfer: bindActionCreators(getCreditTransfer, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  prepareSigningAuthorityConfirmations: (creditTradeId, terms) =>
    prepareSigningAuthorityConfirmations(creditTradeId, terms),
  updateCommentOnCreditTransfer: bindActionCreators(updateCommentOnCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferEditContainer);
