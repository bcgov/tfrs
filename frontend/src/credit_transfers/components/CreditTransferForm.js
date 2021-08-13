/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';

import Errors from '../../app/components/Errors';
import Tooltip from '../../app/components/Tooltip';
import * as NumberFormat from '../../constants/numeralFormats';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferFormDetails from './CreditTransferFormDetails';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';
import CreditTransferFormButtons from './CreditTransferFormButtons';
import CreditTransferTerms from './CreditTransferTerms';
import CreditTransferCommentForm from './CreditTransferCommentForm';
import CreditTransferComment from './CreditTransferComment';

const CreditTransferForm = props => (
  <div className="credit-transfer">
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
            }){` `}
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
    <h1>{props.title}</h1>
    <h3>
      <p>
        Under section 11.11 (1) (a) of the Renewable and Low Carbon Fuel Requirements Regulation,
        a transfer of validated credits is not effective unless the transfer is approved by the
        Director.
      </p>
      <p>
        All credit transfer proposals must include a “fair market value” of any consideration,
        under section 11.11 (2) (c) (iv) of the Regulation. Transfers deemed to underestimate
        &quot;fair market value&quot; or those using a &quot;zero dollar&quot; value must include
        a written explanation justifying the use of the identified credit value.
      </p>
    </h3>
    <CreditTransferProgress status={CREDIT_TRANSFER_STATUS.draft} type={props.fields.tradeType} />
    <form
      className="form-inline"
      onSubmit={(event, status) =>
        props.handleSubmit(event, CREDIT_TRANSFER_STATUS.draft)}
    >
      <CreditTransferFormDetails
        fields={props.fields}
        fuelSuppliers={props.fuelSuppliers}
        handleInputChange={props.handleInputChange}
        loggedInUser={props.loggedInUser}
        totalValue={props.totalValue}
      />

      {Object.keys(props.errors).length > 0 &&
        <Errors errors={props.errors} />
      }

      {Object.keys(props.validationErrors).length > 0 &&
        <Errors errors={props.validationErrors} />
      }

      <CreditTransferVisualRepresentation
        creditsFrom={props.creditsFrom}
        creditsTo={props.creditsTo}
        loggedInUser={props.loggedInUser}
        numberOfCredits={props.fields.numberOfCredits}
        totalValue={props.totalValue}
        tradeType={props.fields.tradeType}
        zeroDollarReason={props.zeroDollarReason}
      />

      {(props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)) &&
        <CreditTransferTerms
          addToFields={props.addToFields}
          fields={props.fields}
          signingAuthorityAssertions={props.signingAuthorityAssertions}
          toggleCheck={props.toggleCheck}
        />
      }

      <CreditTransferCommentForm
        isCommentingOnUnsavedCreditTransfer={props.id === 0}
        isCreatingPrivilegedComment={false}
        handleCommentChanged={props.handleCommentChanged}
        embedded
      />
      {props.comments.length > 0 && <h3 className="comments-header">Comments</h3>}
      {props.comments.length > 0 && <span>Save your transfer to modify existing comments</span>}
      {props.comments.map(c => (
        <CreditTransferComment comment={c} key={c.id} isReadOnly />
      ))
      }

      <CreditTransferFormButtons
        actions={props.buttonActions}
        changeStatus={props.changeStatus}
        disabled={
          {
            BTN_SIGN_1_2: !props.fields.terms ||
            props.fields.terms.filter(term =>
              term.value === true).length < props.signingAuthorityAssertions.items.length
          }
        }
        permissions={
          {
            BTN_SIGN_1_2:
            props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN),
            BTN_SIGN_2_2:
            props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)
          }
        }
        id={props.id}
      />
    </form>
  </div>
);

CreditTransferForm.defaultProps = {
  handleCommentChanged: null,
  id: 0,
  comments: [],
  title: 'Credit Transfer',
  validationErrors: {},
  zeroDollarReason: {
    id: null
  }
};

CreditTransferForm.propTypes = {
  addToFields: PropTypes.func.isRequired,
  buttonActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeStatus: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    comment: PropTypes.string
  })),
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
    note: PropTypes.string.isRequired
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
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number
    }))
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
};

export default CreditTransferForm;
