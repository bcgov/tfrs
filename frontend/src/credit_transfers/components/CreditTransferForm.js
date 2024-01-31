/*
 * Presentational component
 */
import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { CREDIT_TRANSFER_STATUS } from '../../constants/values'

import Errors from '../../app/components/Errors'
import Tooltip from '../../app/components/Tooltip'
import * as NumberFormat from '../../constants/numeralFormats'
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions'
import CreditTransferProgress from './CreditTransferProgress'
import CreditTransferFormDetails from './CreditTransferFormDetails'
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation'
import CreditTransferFormButtons from './CreditTransferFormButtons'
import CreditTransferTerms from './CreditTransferTerms'
import CreditTransferCommentForm from './CreditTransferCommentForm'
import CreditTransferComment from './CreditTransferComment'
import TOOLTIPS from '../../constants/tooltips'

const CreditTransferForm = (props) => {
  const today = new Date()
  const minDateValue = today.toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setMonth(today.getMonth() + 3)
  // const maxDateValue = maxDate.toISOString().split('T')[0]
  return (
  <div className="credit-transfer">
    <div className="credit_balance">
      {props.loggedInUser.roles && !props.loggedInUser.isGovernmentUser && (
        <h3>
          Compliance Units: {
            numeral(props.loggedInUser.organization.organizationBalance.validatedCredits)
              .format(NumberFormat.INT)
          }
          <div className="reserved">
            (In Reserve:{' '}
            {numeral(
              props.loggedInUser.organization.organizationBalance.deductions
            ).format(NumberFormat.INT)}
            ){' '}
            <Tooltip
              className="info"
              show
              title={TOOLTIPS.IN_RESERVE}
            >
              <FontAwesomeIcon icon="info-circle" />
            </Tooltip>
          </div>
        </h3>
      )}
    </div>
    <h1>{props.title}</h1>
    <h3>
      <p>
        A transfer is not effective until it is recorded by the Director.
      </p>
      <p>
        Transfers must indicate whether they are for consideration, and if so,
        the fair market value of the consideration in Canadian dollars per compliance unit.
      </p>
    </h3>
    <CreditTransferProgress
      status={CREDIT_TRANSFER_STATUS.draft}
      type={props.fields.tradeType}
    />
    <CreditTransferVisualRepresentation
      creditsFrom={props.creditsFrom}
      creditsTo={props.creditsTo}
      loggedInUser={props.loggedInUser}
      numberOfCredits={props.fields.numberOfCredits}
      totalValue={props.totalValue}
      tradeType={props.fields.tradeType}
      zeroDollarReason={props.zeroDollarReason}
    />
    <form
      className="form-inline"
      onSubmit={(event, status) =>
        props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)
      }
    >
      <CreditTransferFormDetails
        fields={props.fields}
        fuelSuppliers={props.fuelSuppliers}
        handleInputChange={props.handleInputChange}
        loggedInUser={props.loggedInUser}
        totalValue={props.totalValue}
      />

      {Object.keys(props.errors).length > 0 && <Errors errors={props.errors} />}

      {Object.keys(props.validationErrors).length > 0 && (
        <Errors errors={props.validationErrors} />
      )}
      <p className="action-context-menu-available">Agreement Date (required)</p>
      <div className="agreementDate">
        <h3>
          Date on which the written agreement for the transfer was reached
          between the organizations:
        </h3>
        <div>
          <label>Agreement Date:</label>
          <input
            className="form-control form-date"
            type="date"
            value={props.fields.dateOfWrittenAgreement}
            max={minDateValue}
            name='dateOfWrittenAgreement'
            onChange={props.handleInputChange}
            required
          />
        </div>
      </div>
      {/* hidden due to new interpretation of legislation August 2023 */}
      {/* <p className="action-context-menu-available">Effective Date (optional)</p>
      <div className="agreementDate">
        <h3>
          The transfer will take effect on the date the Director records the transfer.
        </h3>
        <h3>
          Or, you can enter an effective date that will be used if later than the date
          the Director records the transfer.
        </h3>
        <div>
          <label>Effective Date:</label>
          <input
            className="form-control form-date"
            type="date"
            value={props.fields.tradeEffectiveDate}
            min={minDateValue}
            max={maxDateValue}
            name='tradeEffectiveDate'
            onChange={props.handleInputChange}
          />
        </div>
      </div> */}

      <CreditTransferCommentForm
        isCommentingOnUnsavedCreditTransfer={props.id === 0}
        isCreatingPrivilegedComment={false}
        handleCommentChanged={props.handleCommentChanged}
        embedded
      />
      {props.loggedInUser.hasPermission(
        PERMISSIONS_CREDIT_TRANSACTIONS.SIGN
      ) && (
        <CreditTransferTerms
          addToFields={props.addToFields}
          fields={props.fields}
          signingAuthorityAssertions={props.signingAuthorityAssertions}
          toggleCheck={props.toggleCheck}
        />
      )}

      {props.comments.length > 0 && (
        <h3 className="comments-header">Comments</h3>
      )}
      {props.comments.length > 0 && (
        <span>Save your transfer to modify existing comments</span>
      )}
      {props.comments.map((c) => (
        <CreditTransferComment comment={c} key={c.id} isReadOnly />
      ))}

      <CreditTransferFormButtons
        actions={props.buttonActions}
        changeStatus={props.changeStatus}
        disabled={{
          BTN_SIGN_1_2:
            !props.fields.terms ||
            props.fields.terms.filter((term) => term.value === true).length <
              props.signingAuthorityAssertions.items.length
        }}
        permissions={{
          BTN_SIGN_1_2: props.loggedInUser.hasPermission(
            PERMISSIONS_CREDIT_TRANSACTIONS.SIGN
          ),
          BTN_SIGN_2_2: props.loggedInUser.hasPermission(
            PERMISSIONS_CREDIT_TRANSACTIONS.SIGN
          )
        }}
        id={props.id}
      />
    </form>
  </div>
  )
}

CreditTransferForm.defaultProps = {
  handleCommentChanged: null,
  id: 0,
  comments: [],
  title: 'Transfer',
  validationErrors: {},
  zeroDollarReason: {
    id: null
  }
}

CreditTransferForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  buttonActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeStatus: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      comment: PropTypes.string
    })
  ),
  fields: PropTypes.shape({
    initiator: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    respondent: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    terms: PropTypes.array,
    tradeType: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    }),
    numberOfCredits: PropTypes.string,
    fairMarketValuePerCredit: PropTypes.string,
    zeroDollarReason: PropTypes.shape({
      reason: PropTypes.string,
      id: PropTypes.number
    }),
    note: PropTypes.string.isRequired,
    dateOfWrittenAgreement: PropTypes.string,
    tradeEffectiveDate: PropTypes.string
  }).isRequired,
  creditsTo: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  creditsFrom: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  fuelSuppliers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCommentChanged: PropTypes.func,
  id: PropTypes.number,
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
      })
    }),
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number
      })
    )
  }).isRequired,
  signingAuthorityAssertions: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape())
  }).isRequired,
  title: PropTypes.string,
  toggleCheck: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired,
  validationErrors: PropTypes.shape({}),
  zeroDollarReason: PropTypes.shape({
    id: PropTypes.number,
    reason: PropTypes.string
  })
}

export default CreditTransferForm
