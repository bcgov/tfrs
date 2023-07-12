/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import CreditTransferFormButtons from './CreditTransferFormButtons'
import CreditTransferProgress from './CreditTransferProgress'
import CreditTransferTerms from './CreditTransferTerms'
import CreditTransferTextRepresentation from './CreditTransferTextRepresentation'
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation'

import { getCreditTransferType } from '../../actions/creditTransfersActions'
import Errors from '../../app/components/Errors'
import Loading from '../../app/components/Loading'
import Tooltip from '../../app/components/Tooltip'
import * as Lang from '../../constants/langEnUs'
import * as NumberFormat from '../../constants/numeralFormats'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import CreditTransferCommentForm from './CreditTransferCommentForm'
import CreditTransferComment from './CreditTransferComment'
import CreditTransferCommentButtons from './CreditTransferCommentButtons'
import CreditTransferSigningHistory from './CreditTransferSigningHistory'
import CreditTransferDocumentList from './CreditTransferDocumentList'

const CreditTransferDetails = props => (
  <div className="credit-transfer">
    {props.isFetching && <Loading />}
    {!props.isFetching &&
      <div>
        <div className="credit_balance">
          {props.loggedInUser.roles &&
            !props.loggedInUser.isGovernmentUser &&
            <h3>
              Credit Balance: {
                numeral(props.loggedInUser.organization.organizationBalance.validatedCredits)
                  .format(NumberFormat.INT)
              }
              <div className="reserved">
                (In Reserve: {
                  numeral(props.loggedInUser.organization.organizationBalance.deductions)
                    .format(NumberFormat.INT)
                }){' '}
                <Tooltip
                  className="info"
                  show
                  title="Reserved credits are the portion of credits in your credit balance that are
                  currently pending the completion of a credit transaction. For example, selling
                  credits to another organization (i.e. Credit Transfer) or being used to offset
                  outstanding debits in a compliance period. Reserved credits cannot be transferred
                  or otherwise used until the pending credit transaction has been completed."
                >
                  <FontAwesomeIcon icon="info-circle" />
                </Tooltip>
              </div>
            </h3>
          }
        </div>
        <h1>
          {props.tradeType.id &&
            getCreditTransferType(props.tradeType.id)
          } — ID: {props.id}
        </h1>
        {[
          CREDIT_TRANSFER_TYPES.buy.id,
          CREDIT_TRANSFER_TYPES.sell.id
        ].indexOf(props.tradeType.id) >= 0 &&
        <h3>
          {props.status.id !== CREDIT_TRANSFER_STATUS.approved.id &&
          <p>
            Under section 11.11 (1) (a) of the Renewable and Low Carbon Fuel Requirements
            Regulation, a transfer of validated credits is not effective unless the transfer
            is approved by the Director.
          </p>
          }
          {[
            CREDIT_TRANSFER_STATUS.draft.id,
            CREDIT_TRANSFER_STATUS.proposed.id
          ].indexOf(props.status.id) >= 0 &&
          <p>
            All credit transfer proposals must include a “fair market value” of any
            consideration, under section 11.11 (2) (c) (iv) of the Regulation. Transfers
            deemed to underestimate &quot;fair market value&quot; or those using a
            &quot;zero dollar&quot; value must include a written explanation justifying
            the use of the identified credit value.
          </p>
          }
        </h3>
        }
        <CreditTransferProgress
          isRescinded={props.isRescinded}
          status={props.status}
          type={props.tradeType}
        />
        <CreditTransferVisualRepresentation
          creditsFrom={props.creditsFrom}
          creditsTo={props.creditsTo}
          loggedInUser={props.loggedInUser}
          numberOfCredits={props.numberOfCredits}
          status={props.status}
          totalValue={props.totalValue}
          tradeType={props.tradeType}
          zeroDollarReason={props.zeroDollarReason}
        />
        <div className="credit-transfer-details">
          <div className="main-form">
            <CreditTransferTextRepresentation
              compliancePeriod={props.compliancePeriod}
              creditsFrom={props.creditsFrom}
              creditsTo={props.creditsTo}
              fairMarketValuePerCredit={props.fairMarketValuePerCredit}
              history={props.history}
              isRescinded={props.isRescinded}
              numberOfCredits={props.numberOfCredits}
              status={props.status}
              totalValue={props.totalValue}
              tradeEffectiveDate={props.tradeEffectiveDate}
              tradeType={props.tradeType}
              zeroDollarReason={props.zeroDollarReason}
              categoryDSelected={props.categoryDSelected}
              toggleCategoryDSelection={props.toggleCategoryDSelection}
              loggedInUser={props.loggedInUser}
            />
          </div>
        </div>
        {Object.keys(props.errors).length > 0 &&
          <Errors errors={props.errors} />
        }
        <form onSubmit={e => e.preventDefault()}>
          {(props.buttonActions.includes(Lang.BTN_SIGN_1_2) ||
            props.buttonActions.includes(Lang.BTN_SIGN_2_2)) &&
          (props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)) &&
          <CreditTransferTerms
            addToFields={props.addToFields}
            fields={props.fields}
            signingAuthorityAssertions={props.signingAuthorityAssertions}
            toggleCheck={props.toggleCheck}
          />
          }
          {props.documents && props.documents.length > 0 &&
            <div className="row credit-transfer-document-list">
              <div className="col-md-6">
                <CreditTransferDocumentList documents={props.documents} />
              </div>
            </div>
          }
          {props.status.id !== CREDIT_TRANSFER_STATUS.draft.id &&
          (props.history.length > 0 || props.signatures.length > 0) &&
          <CreditTransferSigningHistory
            tradeEffectiveDate={props.tradeEffectiveDate}
            dateOfWrittenAgreement={props.dateOfWrittenAgreement}
            categoryDSelected={props.categoryDSelected}
            history={props.history}
            signatures={props.signatures}
            loggedInUser={props.loggedInUser}
          />
          }
          {props.comments.length > 0 && <h3 className="comments-header">Comments</h3>}
          {props.comments.map(c => (
            <CreditTransferComment
              comment={c}
              key={c.id}
              saveComment={props.saveComment}
              selectIdForModal={props.selectIdForModal}
            />
          ))
          }
          {props.isCommenting && <CreditTransferCommentForm
            saveComment={props.saveComment}
            cancelComment={props.cancelComment}
            isCreatingPrivilegedComment={props.isCreatingPrivilegedComment}
            selectIdForModal={props.selectIdForModal}
          />
          }
          <CreditTransferCommentButtons
            canComment={props.canComment}
            isCommenting={props.isCommenting}
            addComment={props.addComment}
            canCreatePrivilegedComment={props.canCreatePrivilegedComment}
          />

          <CreditTransferFormButtons
            actions={props.buttonActions}
            addComment={props.addComment}
            changeStatus={props.changeStatus}
            disabled={
              {
                BTN_RECOMMEND: [
                  CREDIT_TRANSFER_TYPES.validation.id,
                  CREDIT_TRANSFER_TYPES.retirement.id,
                  CREDIT_TRANSFER_TYPES.part3Award.id].includes(props.tradeType.id) &&
                  props.comments.length === 0,
                BTN_SIGN_1_2: props.fields.terms.filter(term =>
                  term.value === true).length < props.signingAuthorityAssertions.items.length,
                BTN_SIGN_2_2: props.loggedInUser.organization.statusDisplay !== 'Active'
                  ? true
                  : props.fields.terms.filter(term =>
                    term.value === true).length < props.signingAuthorityAssertions.items.length,
                organizationName: props.loggedInUser.organization.name,
                inactiveSupplier: props.loggedInUser.organization.statusDisplay !== 'Active'
              }
            }
            id={props.id}
            isCommenting={props.isCommenting}
            permissions={
              {
                BTN_SIGN_1_2:
                props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN),
                BTN_SIGN_2_2:
                props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)
              }
            }
          />
        </form>
      </div>
    }
  </div>
)

CreditTransferDetails.defaultProps = {
  compliancePeriod: {
    description: ''
  },
  creditsFrom: {
    name: '...'
  },
  creditsTo: {
    name: '...'
  },
  zeroDollarReason: {
    id: null
  },
  errors: {},
  fairMarketValuePerCredit: '0',
  history: [],
  id: 0,
  isRescinded: false,
  note: '',
  numberOfCredits: '0',
  rescinded: false,
  signatures: [],
  status: {
    id: 0,
    status: ''
  },
  totalValue: '0',
  tradeEffectiveDate: '',
  dateOfWrittenAgreement: '',
  tradeType: {
    theType: 'sell'
  },
  comments: [],
  documents: []
}

CreditTransferDetails.propTypes = {
  addToFields: PropTypes.func.isRequired,
  buttonActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeStatus: PropTypes.func.isRequired,
  compliancePeriod: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string
  }),
  creditsFrom: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }),
  creditsTo: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }),
  errors: PropTypes.shape({}),
  fairMarketValuePerCredit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  zeroDollarReason: PropTypes.shape({
    id: PropTypes.number,
    reason: PropTypes.string
  }),
  fields: PropTypes.shape({
    terms: PropTypes.array
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    isGovernmentUser: PropTypes.bool,
    organization: PropTypes.shape({
      actionsTypeDisplay: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      organizationBalance: PropTypes.shape({
        deductions: PropTypes.number,
        validatedCredits: PropTypes.number
      }),
      statusDisplay: PropTypes.string
    }),
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    }))
  }).isRequired,
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
  isFetching: PropTypes.bool.isRequired,
  isRescinded: PropTypes.bool,
  note: PropTypes.string,
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
  signingAuthorityAssertions: PropTypes.shape().isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }),
  toggleCheck: PropTypes.func.isRequired,
  totalValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  tradeEffectiveDate: PropTypes.string,
  dateOfWrittenAgreement: PropTypes.string,
  tradeType: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    theType: PropTypes.string
  }),
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
  canComment: PropTypes.bool.isRequired,
  addComment: PropTypes.func.isRequired,
  cancelComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  isCommenting: PropTypes.bool.isRequired,
  hasCommented: PropTypes.bool.isRequired,
  canCreatePrivilegedComment: PropTypes.bool.isRequired,
  isCreatingPrivilegedComment: PropTypes.bool.isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape),
  selectIdForModal: PropTypes.func.isRequired,
  categoryDSelected: PropTypes.bool,
  toggleCategoryDSelection: PropTypes.func.isRequired
}

export default CreditTransferDetails
