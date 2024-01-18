/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Modal from '../app/components/Modal'
import CreditTransferForm from './components/CreditTransferForm'
import GovernmentTransferForm from './components/GovernmentTransferForm'
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer'

import { getFuelSuppliers } from '../actions/organizationActions'
import { getLoggedInUser, getUpdatedLoggedInUser } from '../actions/userActions'
import {
  addCommentToCreditTransfer,
  addCreditTransfer,
  invalidateCreditTransfer,
  invalidateCreditTransfers
} from '../actions/creditTransfersActions'
import getSigningAuthorityAssertions from '../actions/signingAuthorityAssertionsActions'
import {
  addSigningAuthorityConfirmation,
  prepareSigningAuthorityConfirmations
} from '../actions/signingAuthorityConfirmationsActions'
import * as Lang from '../constants/langEnUs'
import COMMENTS from '../constants/permissions/Comments'
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values'
import toastr from '../utils/toastr'
import { withRouter } from '../utils/withRouter'

class CreditTransferAddContainer extends Component {
  constructor (props) {
    super(props)

    if (props.loggedInUser.isGovernmentUser) {
      this.state = {
        fields: {
          comment: '',
          dateOfWrittenAgreement: '',
          tradeEffectiveDate: '',
          compliancePeriod: { id: 0 },
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
        validationErrors: {}
      }
    } else {
      this.state = {
        creditsFrom: {},
        creditsTo: {},
        fields: {
          comment: '',
          dateOfWrittenAgreement: '',
          tradeEffectiveDate: '',
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
        totalValue: 0,
        validationErrors: {}
      }
    }

    this._addComment = this._addComment.bind(this)
    this._addToFields = this._addToFields.bind(this)
    this._changeStatus = this._changeStatus.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleCommentChanged = this._handleCommentChanged.bind(this)
    this._toggleCheck = this._toggleCheck.bind(this)
  }

  componentDidMount () {
    this.props.invalidateCreditTransfer()
    this.props.getFuelSuppliers()
    this.props.getSigningAuthorityAssertions()
  }

  UNSAFE_componentWillReceiveProps (props) {
    // Set the initiator as the logged in user's organization
    const fieldState = { ...this.state.fields }
    fieldState.initiator = this.props.loggedInUser.organization
    this.setState({
      fields: fieldState,
      creditsFrom: fieldState.initiator
    })
  }

  _addComment (privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    })
  }

  _addToFields (value) {
    const fieldState = { ...this.state.fields }

    const found = this.state.fields.terms.find(term => term.id === value.id)

    if (!found) {
      fieldState.terms.push(value)
    }

    this.setState({
      fields: fieldState
    })
  }

  _changeStatus (status) {
    this.changeObjectProp(status.id, 'tradeStatus')
  }

  _creditTransferSubmit (status) {
    // swap empty string for null on optional tradeEffectiveDate field
    const formData = { ...this.state.fields }
    if (formData.tradeEffectiveDate === '') {
      formData.tradeEffectiveDate = null
    }

    // API data structure
    const data = {
      fairMarketValuePerCredit: parseFloat(this.state.fields.fairMarketValuePerCredit).toFixed(2),
      initiator: this.state.fields.initiator.id,
      note: this.state.fields.note,
      comment: this.state.fields.comment,
      dateOfWrittenAgreement: this.state.fields.dateOfWrittenAgreement,
      tradeEffectiveDate: formData.tradeEffectiveDate,
      numberOfCredits: this.state.fields.numberOfCredits,
      respondent: this.state.fields.respondent.id,
      status: status.id,
      type: this.state.fields.tradeType.id,
      zeroReason: (this.state.fields.zeroDollarReason != null &&
        this.state.fields.zeroDollarReason.id) || null
    }

    if (data.fairMarketValuePerCredit > 0) {
      data.zeroReason = null
    }

    this.props.addCreditTransfer(data).then((response) => {
      // if it's being proposed capture the acceptance of the terms
      if (status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
        const confirmations = this.props.prepareSigningAuthorityConfirmations(
          response.data.id,
          this.state.fields.terms
        )

        this.props.addSigningAuthorityConfirmation(confirmations)
      }

      this.props.getUpdatedLoggedInUser()
      this.props.invalidateCreditTransfers()
      this.props.navigate(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', response.data.id))
      toastr.creditTransactionSuccess(status.id, data)
    })

    return true
  }

  _governmentTransferSubmit (status) {
    const { comment } = this.state.fields
    const { isCreatingPrivilegedComment } = this.state

    // API data structure
    const data = {
      compliancePeriod: this.state.fields.compliancePeriod.id,
      initiator: this.state.fields.initiator.id,
      numberOfCredits: this.state.fields.numberOfCredits,
      respondent: this.state.fields.respondent.id,
      status: status.id,
      type: this.state.fields.tradeType.id,
      zeroDollarReason: null
    }

    this.props.addCreditTransfer(data).then((response) => {
      this._saveComment(response.data.id, comment, isCreatingPrivilegedComment)

      this.props.invalidateCreditTransfers()
      this.props.navigate(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', response.data.id))
      toastr.creditTransactionSuccess(status.id, data)
    })

    return true
  }

  _handleCommentChanged (comment) {
    const fieldState = { ...this.state.fields }

    fieldState.comment = comment

    this.setState({
      fields: fieldState
    })
  }

  _handleInputChange (event) {
    const { value, name } = event.target
    const fieldState = { ...this.state.fields }

    if (typeof fieldState[name] === 'object') {
      this.changeObjectProp(parseInt(value, 10), name)
    } else {
      fieldState[name] = value
      this.setState({
        fields: fieldState
      }, () => this.computeTotalValue(name))
    }
  }

  _handleSubmit (event, status) {
    event.preventDefault()

    // Government Transfer Submit
    if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id]
      .indexOf(this.state.fields.tradeType.id) < 0) {
      this._governmentTransferSubmit(status)
    } else { // Transfer Submit
      this._creditTransferSubmit(status)
    }

    return false
  }

  _saveComment (id, comment, privileged = false) {
    // API data structure
    const data = {
      creditTrade: id,
      comment,
      privilegedAccess: privileged
    }

    if (comment.length > 0) {
      return this.props.addCommentToCreditTransfer(data)
    }

    return false
  }

  _renderCreditTransfer () {
    const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_SIGN_1_2]

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
        handleCommentChanged={this._handleCommentChanged}
        handleInputChange={this._handleInputChange}
        handleSubmit={this._handleSubmit}
        key="creditTransferForm"
        loggedInUser={this.props.loggedInUser}
        signingAuthorityAssertions={this.props.signingAuthorityAssertions}
        terms={this.state.terms}
        title="New Transfer"
        toggleCheck={this._toggleCheck}
        totalValue={this.state.totalValue}
        validationErrors={this.state.validationErrors}
        zeroDollarReason={this.state.fields.zeroDollarReason}
      />,
      <ModalSubmitCreditTransfer
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.proposed)
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
    ])
  }

  _renderGovernmentTransfer () {
    const buttonActions = [Lang.BTN_SAVE_DRAFT, Lang.BTN_RECOMMEND_FOR_DECISION]

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
        title="New Initiative Agreement Issuance"
        validationErrors={this.state.validationErrors}
      />,
      <Modal
        handleSubmit={(event) => {
          this._handleSubmit(event, CREDIT_TRANSFER_STATUS.recommendedForDecision)
        }}
        id="confirmRecommend"
        key="confirmRecommend"
        confirmLabel="Recommend issuance"
        cancelLabel="Cancel"
      >
        Are you sure you want to recommend issuance of compliance units
        for this Initiative Agreement?
      </Modal>
    ])
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields }
    const index = fieldState.terms.findIndex(term => term.id === key)
    fieldState.terms[index].value = !fieldState.terms[index].value

    this.setState({
      fields: fieldState
    })
  }

  changeFromTo (tradeType, initiator, respondent) {
    // Change the creditsFrom and creditsTo according to the trade type
    let creditsFrom = initiator
    let creditsTo = respondent
    if (tradeType.id === 2) {
      creditsFrom = respondent
      creditsTo = initiator
    }

    this.setState({ creditsFrom, creditsTo })
  }

  changeObjectProp (id, name) {
    const fieldState = { ...this.state.fields }

    if (name === 'respondent') {
      // Populate the dropdown
      const respondents = this.props.fuelSuppliers.filter(fuelSupplier => (fuelSupplier.id === id))

      fieldState.respondent = respondents.length === 1 ? respondents[0] : { id: 0 }
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ))
    } else if (name === 'tradeType') {
      fieldState[name] = { id: id || 0 }
      this.setState({
        fields: fieldState
      }, () => this.changeFromTo(
        this.state.fields.tradeType,
        this.state.fields.initiator,
        this.state.fields.respondent
      ))
    } else {
      fieldState[name] = { id: id || 0 }
      this.setState({
        fields: fieldState
      })
    }
  }

  computeTotalValue (name) {
    // Compute the total value when the fields change
    if (['numberOfCredits', 'fairMarketValuePerCredit'].includes(name)) {
      this.setState({
        totalValue:
          this.state.fields.numberOfCredits * this.state.fields.fairMarketValuePerCredit
      })
    }
  }

  render () {
    if (this.props.loggedInUser.isGovernmentUser) {
      return this._renderGovernmentTransfer()
    }

    return this._renderCreditTransfer()
  }
}

CreditTransferAddContainer.defaultProps = {
  errors: {},
  validationErrors: {}
}

CreditTransferAddContainer.propTypes = {
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  addCreditTransfer: PropTypes.func.isRequired,
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFuelSuppliers: PropTypes.func.isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
  getUpdatedLoggedInUser: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  invalidateCreditTransfers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  prepareSigningAuthorityConfirmations: PropTypes.func.isRequired,
  signingAuthorityAssertions: PropTypes.shape().isRequired,
  validationErrors: PropTypes.shape(),
  navigate: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  fuelSuppliers: state.rootReducer.fuelSuppliersRequest.fuelSuppliers,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  signingAuthorityAssertions: {
    isFetching: state.rootReducer.signingAuthorityAssertions.isFetching,
    items: state.rootReducer.signingAuthorityAssertions.items
  }
})

const mapDispatchToProps = dispatch => ({
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  addCreditTransfer: bindActionCreators(addCreditTransfer, dispatch),
  addSigningAuthorityConfirmation: bindActionCreators(addSigningAuthorityConfirmation, dispatch),
  getFuelSuppliers: bindActionCreators(getFuelSuppliers, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  getSigningAuthorityAssertions: bindActionCreators(getSigningAuthorityAssertions, dispatch),
  getUpdatedLoggedInUser: bindActionCreators(getUpdatedLoggedInUser, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  invalidateCreditTransfers: bindActionCreators(invalidateCreditTransfers, dispatch),
  prepareSigningAuthorityConfirmations: (creditTradeId, terms) =>
    prepareSigningAuthorityConfirmations(creditTradeId, terms)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreditTransferAddContainer))
