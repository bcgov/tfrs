/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Modal from '../app/components/Modal';
import CreditTransferForm from './components/CreditTransferForm';
import GovernmentTransferForm from './components/GovernmentTransferForm';
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer';

import { getFuelSuppliers } from '../actions/organizationActions';
import { getLoggedInUser } from '../actions/userActions';
import {
  addCommentToCreditTransfer,
  addCreditTransfer,
  invalidateCreditTransfer,
  invalidateCreditTransfers
} from '../actions/creditTransfersActions';
import {
  addSigningAuthorityConfirmation,
  prepareSigningAuthorityConfirmations
} from '../actions/signingAuthorityConfirmationsActions';
import history from '../app/History';
import * as Lang from '../constants/langEnUs';
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values';
import toastr from '../utils/toastr';

class CreditTransferAddContainer extends Component {
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
        }
      };
    } else {
      this.state = {
        comment: null,
        creditsFrom: {},
        creditsTo: {},
        fields: {
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
        totalValue: 0
      };
    }

    this._addToFields = this._addToFields.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCommentChanged = this._handleCommentChanged.bind(this);
    this._toggleCheck = this._toggleCheck.bind(this);
  }

  componentDidMount () {
    this.props.invalidateCreditTransfer();
    this.props.getFuelSuppliers();
  }

  componentWillReceiveProps (props) {
    // Set the initiator as the logged in user's organization
    const fieldState = { ...this.state.fields };
    fieldState.initiator = this.props.loggedInUser.organization;
    this.setState({
      fields: fieldState,
      creditsFrom: fieldState.initiator
    });
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields };
    fieldState.terms.push(value);

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
      comment: this.state.comment,
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

    this.props.addCreditTransfer(data).then((response) => {
      // if it's being proposed capture the acceptance of the terms
      if (status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
        const confirmations = this.props.prepareSigningAuthorityConfirmations(
          response.data.id,
          this.state.fields.terms
        );

        this.props.addSigningAuthorityConfirmation(confirmations);
      }

      this.props.invalidateCreditTransfers();
      history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', response.data.id));
      toastr.creditTransactionSuccess(status.id, data);
    });
  }

  _governmentTransferSubmit (status) {
    // API data structure
    const data = {
      comment: this.state.fields.comment,
      compliancePeriod: this.state.fields.compliancePeriod.id,
      initiator: this.state.fields.initiator.id,
      numberOfCredits: parseInt(this.state.fields.numberOfCredits, 10),
      respondent: this.state.fields.respondent.id,
      status: status.id,
      type: this.state.fields.tradeType.id,
      zeroDollarReason: null
    };

    this.props.addCreditTransfer(data).then((response) => {
      this.props.invalidateCreditTransfers();
      history.push(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', response.data.id));
      toastr.creditTransactionSuccess(status.id, data);
    });
  }

  _handleInputChange (event) {
    const { value, name } = event.target;
    const fieldState = { ...this.state.fields };

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
    this.setState({
      comment
    });
  }

  _renderCreditTransfer () {
    const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_SIGN_1_2];

    return ([
      <CreditTransferForm
        addToFields={this._addToFields}
        buttonActions={buttonActions}
        changeStatus={this._changeStatus}
        creditsFrom={this.state.creditsFrom}
        creditsTo={this.state.creditsTo}
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        handleCommentChanged={this._handleCommentChanged}
        key="creditTransferForm"
        zeroDollarReason={this.state.fields.zeroDollarReason}
        loggedInUser={this.props.loggedInUser}
        terms={this.state.terms}
        title="New Credit Transfer"
        toggleCheck={this._toggleCheck}
        totalValue={this.state.totalValue}
      />,
      <ModalSubmitCreditTransfer
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed);
        }}
        item={
          {
            creditsFrom: this.state.creditsFrom,
            creditsTo: this.state.creditsTo,
            fairMarketValuePerCredit: this.state.fields.fairMarketValuePerCredit,
            numberOfCredits: this.state.fields.numberOfCredits
          }
        }
        key="confirmSubmit"
      />
    ]);
  }

  _renderGovernmentTransfer () {
    const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_RECOMMEND_FOR_DECISION];

    return ([
      <GovernmentTransferForm
        actions={buttonActions}
        errors={this.props.errors}
        fields={this.state.fields}
        fuelSuppliers={this.props.fuelSuppliers}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="creditTransferForm"
        title="New Credit Transaction"
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.recommendedForDecision);
        }}
        id="confirmRecommend"
        key="confirmRecommend"
      >
        Are you sure you want to recommend approval of this credit transaction?
      </Modal>
    ]);
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields };
    const index = fieldState.terms.findIndex(term => term.id === key);
    fieldState.terms[index].value = !fieldState.terms[index].value;

    this.setState({
      fields: fieldState
    });
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
    if (this.props.loggedInUser.isGovernmentUser) {
      return this._renderGovernmentTransfer();
    }

    return this._renderCreditTransfer();
  }
}

CreditTransferAddContainer.defaultProps = {
  errors: {}
};

CreditTransferAddContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  addCreditTransfer: PropTypes.func.isRequired,
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  prepareSigningAuthorityConfirmations: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  loggedInUser: state.rootReducer.userRequest.loggedInUser
});

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  addCreditTransfer: bindActionCreators(addCreditTransfer, dispatch),
  addSigningAuthorityConfirmation: bindActionCreators(addSigningAuthorityConfirmation, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch),
  prepareSigningAuthorityConfirmations: (creditTradeId, terms) =>
    prepareSigningAuthorityConfirmations(creditTradeId, terms)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditTransferAddContainer);
