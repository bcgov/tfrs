/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CreditTransferDetails from './components/CreditTransferDetails'
import ModalSubmitCreditTransfer from './components/ModalSubmitCreditTransfer'
import CreditTransferUtilityFunctions from './CreditTransferUtilityFunctions'

import {
  addCommentToCreditTransfer,
  deleteCommentOnCreditTransfer,
  updateCommentOnCreditTransfer,
  approveCreditTransfer,
  deleteCreditTransfer,
  getCreditTransferIfNeeded,
  invalidateCreditTransfer,
  partialUpdateCreditTransfer,
  updateCreditTransfer
} from '../actions/creditTransfersActions'
import getSigningAuthorityAssertions from '../actions/signingAuthorityAssertionsActions'
import {
  addSigningAuthorityConfirmation,
  prepareSigningAuthorityConfirmations
} from '../actions/signingAuthorityConfirmationsActions'
import { getLoggedInUser, getUpdatedLoggedInUser } from '../actions/userActions'
import Modal from '../app/components/Modal'
import * as Lang from '../constants/langEnUs'
import CREDIT_TRANSACTIONS from '../constants/routes/CreditTransactions'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../constants/values'
import toastr from '../utils/toastr'
import { withRouter } from '../utils/withRouter'

class CreditTransferViewContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {
        terms: []
      },
      isCommenting: false,
      isCreatingPrivilegedComment: false,
      hasCommented: false,
      selectedId: 0
    }

    this._addComment = this._addComment.bind(this)
    this._addToFields = this._addToFields.bind(this)
    this._cancelComment = this._cancelComment.bind(this)
    this._changeStatus = this._changeStatus.bind(this)
    this._deleteCreditTransfer = this._deleteCreditTransfer.bind(this)
    this._modalAccept = this._modalAccept.bind(this)
    this._modalDecline = this._modalDecline.bind(this)
    this._modalDeclinePVR = this._modalDeclinePVR.bind(this)
    this._modalDelete = this._modalDelete.bind(this)
    this._modalDeleteComment = this._modalDeleteComment.bind(this)
    this._modalNotRecommend = this._modalNotRecommend.bind(this)
    this._modalPullBack = this._modalPullBack.bind(this)
    this._modalRefuse = this._modalRefuse.bind(this)
    this._modalRescind = this._modalRescind.bind(this)
    this._modalReturn = this._modalReturn.bind(this)
    this._modalSubmit = this._modalSubmit.bind(this)
    this._saveComment = this._saveComment.bind(this)
    this._selectIdForModal = this._selectIdForModal.bind(this)
    this._toggleCheck = this._toggleCheck.bind(this)
    this._toggleCategoryDSelection = this._toggleCategoryDSelection.bind(this)
  }

  componentDidMount () {
    this.loadData(this.props.params.id)
    this.props.getSigningAuthorityAssertions()
  }

  componentWillReceiveNewProps (prevProps, newProps) {
    if (prevProps.params.id !== newProps.params.id) {
      this.loadData(newProps.params.id)
    }
  }

  loadData (id) {
    this.props.invalidateCreditTransfer()
    this.props.getCreditTransferIfNeeded(id)
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

  _approveCreditTransfer (id) {
    this.props.approveCreditTransfer(id).then(() => {
      this.props.navigate(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id))
      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.approved.id, this.props.item)
    })
  }

  _buildPVRContent (availableActions) {
    const { item } = this.props
    const buttonActions = []
    const content = []

    if (availableActions.includes(Lang.BTN_SAVE_DRAFT)) {
      buttonActions.push(Lang.BTN_DELETE_DRAFT)
      buttonActions.push(Lang.BTN_EDIT_PVR_DRAFT)

      content.push(this._modalDelete(item))
    }

    if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
      buttonActions.push(Lang.BTN_PULL_BACK)
      content.push(this._modalPullBack())
    }

    if (availableActions.includes(Lang.BTN_RECOMMEND_FOR_DECISION)) {
      buttonActions.push(Lang.BTN_RECOMMEND_FOR_DECISION)

      content.push(this._modalRecommend(item))
    }

    if (availableActions.includes(Lang.BTN_DECLINE_FOR_APPROVAL)) {
      buttonActions.push(Lang.BTN_RETURN_TO_DRAFT)
      buttonActions.push(Lang.BTN_DECLINE_FOR_APPROVAL)

      content.push(this._modalReturn())
      content.push(this._modalDeclinePVR(item))
    }

    if (availableActions.includes(Lang.BTN_APPROVE)) {
      buttonActions.push(Lang.BTN_APPROVE)

      content.push(this._modalApprove(item))
    }

    return {
      buttonActions,
      content
    }
  }

  _buildTransferContent (availableActions) {
    const { item, loggedInUser } = this.props
    const buttonActions = []
    const content = []

    if (item.status.id === CREDIT_TRANSFER_STATUS.draft.id) {
      buttonActions.push(Lang.BTN_SIGN_1_2)

      content.push(this._modalSubmit(item))
    }

    if (item.respondent.id === loggedInUser.organization.id) {
      if (item.status.id === CREDIT_TRANSFER_STATUS.proposed.id) {
        buttonActions.push(Lang.BTN_SIGN_2_2)
        content.push(this._modalAccept())
      }

      if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
        buttonActions.push(Lang.BTN_RESCIND)
        content.push(this._modalRescind())
      }

      if (availableActions.includes(Lang.BTN_REFUSE)) {
        buttonActions.push(Lang.BTN_REFUSE)
        content.push(this._modalRefuse())
      }
    } else if (item.initiator.id === loggedInUser.organization.id) {
      if (availableActions.includes(Lang.BTN_CT_CANCEL)) {
        buttonActions.push(Lang.BTN_RESCIND)
        content.push(this._modalRescind())
      }
    }

    if (availableActions.includes(Lang.BTN_SAVE_DRAFT)) {
      buttonActions.push(Lang.BTN_DELETE_DRAFT)
      buttonActions.push(Lang.BTN_EDIT_DRAFT)

      content.push(this._modalDelete(item))
    }

    if (availableActions.includes(Lang.BTN_RECOMMEND_FOR_DECISION)) {
      buttonActions.push(Lang.BTN_NOT_RECOMMENDED_FOR_DECISION)
      buttonActions.push(Lang.BTN_RECOMMEND_FOR_DECISION)

      content.push(this._modalRecommend(item))
      content.push(this._modalNotRecommend(item))
    }

    if (availableActions.includes(Lang.BTN_DECLINE_FOR_APPROVAL)) {
      buttonActions.push(Lang.BTN_DECLINE_FOR_APPROVAL)

      content.push(this._modalDecline(item))
    }

    if (availableActions.includes(Lang.BTN_APPROVE)) {
      buttonActions.push(Lang.BTN_APPROVE)

      content.push(this._modalApprove(item))
    }

    return {
      buttonActions,
      content
    }
  }

  _changeStatus (status, successMessage = '') {
    const { item } = this.props

    // Update the Status only
    const data = {
      status: status.id
    }

    // Update credit transfer (status only)

    const { id } = this.props.item

    this.props.partialUpdateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer()
      this.props.getUpdatedLoggedInUser()
      this.props.navigate(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id))

      toastr.creditTransactionSuccess(status.id, item, successMessage)
    }, () => {
      // Failed to update
    })

    // if it's being proposed or accepted capture the acceptance of the terms
    if ([
      CREDIT_TRANSFER_STATUS.accepted.id,
      CREDIT_TRANSFER_STATUS.proposed.id
    ].includes(status.id)) {
      const assertions = this.props.prepareSigningAuthorityConfirmations(
        id,
        this.state.fields.terms
      )

      this.props.addSigningAuthorityConfirmation(assertions)
    }
  }

  _deleteCreditTransfer (id) {
    const { item } = this.props

    this.props.deleteCreditTransfer(id).then(() => {
      this.props.invalidateCreditTransfer()
      this.props.navigate(CREDIT_TRANSACTIONS.LIST)
      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.deleted.id, item)
    })
  }

  _saveComment (comment) {
    const { item } = this.props

    // API data structure
    const data = {
      credit_trade: item.id,
      comment: comment.comment,
      privilegedAccess: comment.privilegedAccess
    }

    switch (comment.id) {
      case null:
        this.props.addCommentToCreditTransfer(data).then(() => {
          this.props.invalidateCreditTransfer(this.props.item)
          this.props.getCreditTransferIfNeeded(this.props.item.id)
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          })
        }, () => {
        // Failed to update
        })
        break
      default:
        // we are saving a pre-existing comment
        this.props.updateCommentOnCreditTransfer(comment.id, data).then(() => {
          this.props.invalidateCreditTransfer(this.props.item)
          this.props.getCreditTransferIfNeeded(this.props.item.id)
          this.setState({
            hasCommented: true,
            isCommenting: false,
            isCreatingPrivilegedComment: true
          })
        }, () => {
          // Failed to update
        })
    }
  }

  _selectIdForModal (id) {
    this.setState({
      selectedId: id
    })
  }

  _addComment (privileged = false) {
    this.setState({
      isCommenting: true,
      isCreatingPrivilegedComment: privileged
    })
  }

  _cancelComment () {
    this.setState({
      isCommenting: false,
      isCreatingPrivilegedComment: false
    })
  }

  _modalAccept () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.accepted)
        }}
        id="confirmAccept"
        key="confirmAccept"
        confirmLabel="Sign and submit"
        cancelLabel="Cancel"
      >
        Are you sure you want to sign and submit this transfer
        to the Government of British Columbia for review?
      </Modal>
    )
  }

  _modalApprove (item) {
    return (
      <Modal
        handleSubmit={() => this._approveCreditTransfer(item.id)}
        id="confirmApprove"
        key="confirmApprove"
        confirmLabel={[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0 ? Lang.BTN_APPROVE_1_2 : Lang.BTN_APPROVE_ISSUANCE}
        cancelLabel="Cancel"
      >
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? 'Are you sure you want to record this transfer?'
          : 'Are you sure you want to approve the issuance of credits for this Initiative Agreement?'}
      </Modal>
    )
  }

  _modalDecline (item) {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.declinedForApproval)
        }}
        id="confirmDecline"
        key="confirmDecline"
        confirmLabel="Refuse transfer"
        cancelLabel="Cancel"
      >
        <div className="alert alert-warning">
          <p>
            Under section 19 of the Low Carbon Fuels (General) Regulation, the director may refuse to record a transfer under section 16 of the Act if:
          </p>
          <dl>
            <dt>(a)</dt>
            <dd>
              the director considers that
              <dl>
                <dt>(i)</dt>
                <dd>the transferor will be unable to meet the target set under section 12 <i>[low carbon fuel target]</i> of the Act, or</dd>
              </dl>
              <dl>
                <dt>(ii)</dt>
                <dd>the intent of the transfer is to avoid compliance with the Act, or</dd>
              </dl>
            </dd>
          </dl>
          <dl>
            <dt>(b)</dt>
            <dd>
              all of the following apply:
              <dl>
                <dt>(i)</dt>
                <dd>the director is conducting a reassessment in relation to the transferor;</dd>
              </dl>
              <dl>
                <dt>(ii)</dt>
                <dd>the director has reason to believe that the transferor was issued a number of compliance units as a result of fraud or misrepresentation, and</dd>
              </dl>
              <dl>
                <dt>(iii)</dt>
                <dd>the director has reason to believe that, if the transfer is recorded, the transferor will have a negative balance on reassessment.</dd>
              </dl>
            </dd>
          </dl>
          <p>
            You are strongly encouraged to add a comment
            that provides an explanation as to why the proposed transfer is being refused. The
            comment will be visible to both organizations involved in the transfer.
          </p>
        </div>

        Are you sure you want to refuse this
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' transfer'
          : ' Part 3 Award'}?
      </Modal>
    )
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
    )
  }

  _modalDeleteComment () {
    return (
      <Modal
        handleSubmit={() => {
          this.props.deleteCommentOnCreditTransfer(this.state.selectedId).then(() => {
            this.props.invalidateCreditTransfer()
            this.props.getCreditTransferIfNeeded(this.props.params.id)
          })
        }}
        id="confirmDeleteComment"
        key="confirmDeleteComment"
      >
        Are you sure you want to delete this comment?
      </Modal>
    )
  }

  _modalNotRecommend (item) {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.notRecommended)
        }}
        canBypassExtraConfirm={false}
        extraConfirmText="An explanatory comment is required when recommending
          that the Director refuse a transfer."
        showExtraConfirm={!this.state.hasCommented}
        extraConfirmType="error"
        id="confirmNotRecommend"
        key="confirmNotRecommend"
        confirmLabel="Recommend refusing transfer"
        cancelLabel="Cancel"
      >
        Are you sure you want to recommend that the Director refuse this
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' transfer'
          : ' Part 3 Award'}?
      </Modal>
    )
  }

  _modalPullBack () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.draft, 'Recalled as draft.')
        }}
        id="confirmPullBack"
        key="confirmPullBack"
        cancelLabel="Cancel"
        confirmLabel="Retract recommendation"
      >
        Are you sure you want to retract your recommendation? <br />
        This will return the transaction to a draft state where
        it will no longer be visible to the Director.
      </Modal>
    )
  }

  _modalDeclinePVR (item) {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.declinedForApproval)
        }}
        id="confirmDecline"
        key="confirmDecline"
        confirmLabel={[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0 ? 'Decline' : Lang.BTN_DECLINE_ISSUANCE}
        cancelLabel='Cancel'
      >
        <div className="alert alert-warning">
          <p>
          You are strongly encouraged to add a comment that provides an explanation
          as to why you are not satisfied by the evidence provided that the organization
           has completed the designated action. This declined transaction will be visible
            to the organization that is a party to the Initiative Agreement.
          </p>
        </div>

        Are you sure you want to decline
        {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0
          ? ' to approve this Credit Transfer Proposal'
          : ' the issuance of credits for this Initiative Agreement'}?
      </Modal>
    )
  }

  _modalRecommend (item) {
    const isBuyOrSell = [CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(item.type.id) >= 0;

    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.recommendedForDecision)
        }}
        id="confirmRecommend"
        key="confirmRecommend"
        confirmLabel={
          isBuyOrSell
            ? "Recommend recording transfer"
            : "Recommend issuance"
        }
        cancelLabel="Cancel"
      >
        {
          isBuyOrSell
            ? 'Are you sure you want to recommend recording this transfer?'
            : 'Are you sure you want to recommend issuance of compliance units for this Initiative Agreement?'
        }
      </Modal>
    )
  }

  _modalRefuse () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.refused)
        }}
        id="confirmRefuse"
        key="confirmRefuse"
        confirmLabel="Decline transfer"
        cancelLabel="Cancel"
      >
        Are you sure you want to decline this transfer?
      </Modal>
    )
  }

  _modalRescind () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._rescind()
        }}
        id="confirmRescind"
        key="confirmRescind"
        confirmLabel="Rescind transfer"
        cancelLabel="Cancel"
      >
        Are you sure you want to rescind this transfer?
      </Modal>
    )
  }

  _modalReturn () {
    return (
      <Modal
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.draft, 'Returned to Analyst.')
        }}
        id="confirmReturn"
        key="confirmReturn"
        confirmLabel="Return to analyst"
        cancelLabel="Cancel"
      >
        Are you sure you want to return this Initiative Agreement transaction to the Government Analyst?
      </Modal>
    )
  }

  _modalSubmit (item) {
    return (
      <ModalSubmitCreditTransfer
        handleSubmit={(event) => {
          this._changeStatus(CREDIT_TRANSFER_STATUS.proposed)
        }}
        item={item}
        key="confirmSubmit"
      />
    )
  }

  _rescind () {
    // Change the rescinded flag only
    const { item } = this.props

    // Update the isRescinded field only
    const data = {
      isRescinded: true
    }

    const { id } = this.props.item

    this.props.partialUpdateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer()
      this.props.getUpdatedLoggedInUser()
      this.props.navigate(CREDIT_TRANSACTIONS.HIGHLIGHT.replace(':id', id))

      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.rescinded.id, item)
    }, () => {
      // Failed to update
    })
  }

  _toggleCheck (key) {
    const fieldState = { ...this.state.fields }
    const index = fieldState.terms.findIndex(term => term.id === key)
    fieldState.terms[index].value = !fieldState.terms[index].value

    this.setState({
      fields: fieldState
    })
  }

  _toggleCategoryDSelection (value) {
    // Change the category d flag only
    const { item } = this.props

    // Update the category_d_selected field only
    const data = {
      categoryDSelected: value
    }

    const { id } = this.props.item

    this.props.partialUpdateCreditTransfer(id, data).then(() => {
      this.props.invalidateCreditTransfer()
      this.props.getUpdatedLoggedInUser()
      this.props.navigate(CREDIT_TRANSACTIONS.DETAILS.replace(':id', id))

      toastr.creditTransactionSuccess(CREDIT_TRANSFER_STATUS.updated.id, item, 'Category D updated.')
    }, () => {
      // Failed to update
    })
  }

  render () {
    const { isFetching, item, loggedInUser } = this.props
    let availableActions = []
    let buttonActions = []
    let content = []

    if (!isFetching && item.actions && !item.isRescinded) {
      // TODO: Add util function to return appropriate actions
      availableActions = item.actions.map(action => (
        action.action
      ))

      if ([CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].includes(item.type.id)) {
        ({ buttonActions, content } = this._buildTransferContent(availableActions))
      } else {
        ({ buttonActions, content } = this._buildPVRContent(availableActions))
      }
    }

    content.push(<CreditTransferDetails
      addToFields={this._addToFields}
      buttonActions={buttonActions}
      changeStatus={this._changeStatus}
      compliancePeriod={item.compliancePeriod}
      creditsFrom={item.creditsFrom}
      creditsTo={item.creditsTo}
      documents={item.documents}
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
      zeroDollarReason={item.zeroReason}
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
      selectIdForModal={this._selectIdForModal}
      signingAuthorityAssertions={this.props.signingAuthorityAssertions}
      categoryDSelected={this.props.item.categoryDSelected}
      toggleCategoryDSelection={this._toggleCategoryDSelection}
      dateOfWrittenAgreement={item.dateOfWrittenAgreement}
      updateTimestamp={item.updateTimestamp}
    />)

    content.push(this._modalDeleteComment())

    return content
  }
}

CreditTransferViewContainer.defaultProps = {
  errors: {},
  item: {}
}

CreditTransferViewContainer.propTypes = {
  addSigningAuthorityConfirmation: PropTypes.func.isRequired,
  approveCreditTransfer: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  getCreditTransferIfNeeded: PropTypes.func.isRequired,
  getSigningAuthorityAssertions: PropTypes.func.isRequired,
  getUpdatedLoggedInUser: PropTypes.func.isRequired,
  invalidateCreditTransfer: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    actions: PropTypes.arrayOf(PropTypes.shape({})),
    commentActions: PropTypes.arrayOf(PropTypes.string),
    creditsFrom: PropTypes.shape({}),
    creditsTo: PropTypes.shape({}),
    documents: PropTypes.arrayOf(PropTypes.shape),
    status: PropTypes.shape({
      id: PropTypes.number
    }),
    fairMarketValuePerCredit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    zeroReason: PropTypes.shape({
      id: PropTypes.number,
      reason: PropTypes.string
    }),
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
    ]),
    initiator: PropTypes.shape({
      id: PropTypes.number
    }),
    type: PropTypes.shape({
      id: PropTypes.number
    }),
    respondent: PropTypes.shape({
      id: PropTypes.number
    }),
    compliancePeriod: PropTypes.string,
    note: PropTypes.string,
    tradeEffectiveDate: PropTypes.string,
    dateOfWrittenAgreement: PropTypes.string,
    updateTimestamp: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      createTimestamp: PropTypes.string,
      updateTimestamp: PropTypes.string,
      comment: PropTypes.string,
      privilegedAccess: PropTypes.bool,
      createUser: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        displayName: PropTypes.string,
        organization: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          type: PropTypes.number
        })
      })
    })),
    categoryDSelected: PropTypes.bool
  }),
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  prepareSigningAuthorityConfirmations: PropTypes.func.isRequired,
  addCommentToCreditTransfer: PropTypes.func.isRequired,
  deleteCommentOnCreditTransfer: PropTypes.func.isRequired,
  partialUpdateCreditTransfer: PropTypes.func.isRequired,
  updateCommentOnCreditTransfer: PropTypes.func.isRequired,
  updateCreditTransfer: PropTypes.func.isRequired,
  signingAuthorityAssertions: PropTypes.shape().isRequired,
  navigate: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  errors: state.rootReducer.creditTransfer.errors,
  isFetching: state.rootReducer.creditTransfer.isFetching,
  item: state.rootReducer.creditTransfer.item,
  loggedInUser: state.rootReducer.userRequest.loggedInUser,
  signingAuthorityAssertions: {
    isFetching: state.rootReducer.signingAuthorityAssertions.isFetching,
    items: state.rootReducer.signingAuthorityAssertions.items
  }
})

const mapDispatchToProps = dispatch => ({
  addSigningAuthorityConfirmation: bindActionCreators(addSigningAuthorityConfirmation, dispatch),
  approveCreditTransfer: bindActionCreators(approveCreditTransfer, dispatch),
  deleteCreditTransfer: bindActionCreators(deleteCreditTransfer, dispatch),
  getCreditTransferIfNeeded: bindActionCreators(getCreditTransferIfNeeded, dispatch),
  getLoggedInUser: bindActionCreators(getLoggedInUser, dispatch),
  getUpdatedLoggedInUser: bindActionCreators(getUpdatedLoggedInUser, dispatch),
  getSigningAuthorityAssertions: bindActionCreators(getSigningAuthorityAssertions, dispatch),
  invalidateCreditTransfer: bindActionCreators(invalidateCreditTransfer, dispatch),
  prepareSigningAuthorityConfirmations: (creditTradeId, terms) =>
    prepareSigningAuthorityConfirmations(creditTradeId, terms),
  addCommentToCreditTransfer: bindActionCreators(addCommentToCreditTransfer, dispatch),
  deleteCommentOnCreditTransfer: bindActionCreators(deleteCommentOnCreditTransfer, dispatch),
  partialUpdateCreditTransfer: bindActionCreators(partialUpdateCreditTransfer, dispatch),
  updateCommentOnCreditTransfer: bindActionCreators(updateCommentOnCreditTransfer, dispatch),
  updateCreditTransfer: bindActionCreators(updateCreditTransfer, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreditTransferViewContainer))
