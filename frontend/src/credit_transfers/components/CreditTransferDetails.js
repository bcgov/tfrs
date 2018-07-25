/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import CreditTransferFormButtons from './CreditTransferFormButtons';
import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferTerms from './CreditTransferTerms';
import CreditTransferTextRepresentation from './CreditTransferTextRepresentation';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';

import { getCreditTransferType } from '../../actions/creditTransfersActions';
import Errors from '../../app/components/Errors';
import Loading from '../../app/components/Loading';
import * as Lang from '../../constants/langEnUs';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values';
import PERMISSIONS_CREDIT_TRANSACTIONS from '../../constants/permissions/CreditTransactions';
import CreditTransferCommentForm from './CreditTransferCommentForm';
import CreditTransferComment from './CreditTransferComment';
import CreditTransferCommentButtons from './CreditTransferCommentButtons';
import CreditTransferSigningHistory from './CreditTransferSigningHistory';

const CreditTransferDetails = props => (
  <div className="credit-transfer">
    {props.isFetching && <Loading />}
    {!props.isFetching &&
      <div>
        <h1>
          {props.tradeType.id &&
            getCreditTransferType(props.tradeType.id)
          }
        </h1>
        <CreditTransferProgress
          isRescinded={props.isRescinded}
          status={props.status}
          type={props.tradeType}
        />
        <div className="credit-transfer-details">
          <div className="main-form">
            <CreditTransferTextRepresentation
              compliancePeriod={props.compliancePeriod}
              creditsFrom={props.creditsFrom}
              creditsTo={props.creditsTo}
              fairMarketValuePerCredit={props.fairMarketValuePerCredit}
              numberOfCredits={props.numberOfCredits}
              status={props.status}
              totalValue={props.totalValue}
              tradeEffectiveDate={props.tradeEffectiveDate}
              tradeType={props.tradeType}
            />
          </div>
        </div>
        {Object.keys(props.errors).length > 0 &&
          <Errors errors={props.errors} />
        }
        <CreditTransferVisualRepresentation
          creditsFrom={props.creditsFrom}
          creditsTo={props.creditsTo}
          numberOfCredits={props.numberOfCredits}
          totalValue={props.totalValue}
          tradeType={props.tradeType}
        />
        {props.note !== '' &&
          <div className="well transparent">
            <div>Notes: {props.note}</div>
          </div>
        }
        {props.comments.map(c => (
          <CreditTransferComment comment={c} key={c.id} saveComment={props.saveComment} />
        ))
        }
        {props.isCommenting && <CreditTransferCommentForm
          saveComment={props.saveComment}
          cancelComment={props.cancelComment}
          isCreatingPrivilegedComment={props.isCreatingPrivilegedComment}
        />
        }
        <form onSubmit={e => e.preventDefault()}>
          {(props.buttonActions.includes(Lang.BTN_SIGN_1_2) ||
            props.buttonActions.includes(Lang.BTN_SIGN_2_2)) &&
          (props.loggedInUser.hasPermission(PERMISSIONS_CREDIT_TRANSACTIONS.SIGN)) &&
          <CreditTransferTerms
            addToFields={props.addToFields}
            fields={props.fields}
            toggleCheck={props.toggleCheck}
          />
          }
          <CreditTransferCommentButtons
            canComment={props.canComment}
            isCommenting={props.isCommenting}
            addComment={props.addComment}
            canCreatePrivilegedComment={props.canCreatePrivilegedComment}
          />
          {(props.tradeType.id === CREDIT_TRANSFER_TYPES.sell.id ||
          props.tradeType.id === CREDIT_TRANSFER_TYPES.buy.id) &&
          props.status.id !== CREDIT_TRANSFER_STATUS.draft.id &&
          (props.history.length > 0 || props.signatures.length > 0) &&
            <CreditTransferSigningHistory
              history={props.history}
              signatures={props.signatures}
            />
          }
          <CreditTransferFormButtons
            actions={props.buttonActions}
            addComment={props.addComment}
            changeStatus={props.changeStatus}
            disabled={
              {
                BTN_SIGN_1_2: props.fields.terms.findIndex(term => term.value === false) >= 0 ||
                props.fields.terms.length === 0,
                BTN_SIGN_2_2: props.fields.terms.findIndex(term => term.value === false) >= 0 ||
                props.fields.terms.length === 0
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
);

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
  tradeType: {
    theType: 'sell'
  },
  comments: []
};

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
  fields: PropTypes.shape({
    terms: PropTypes.array
  }).isRequired,
  loggedInUser: PropTypes.shape({
    displayName: PropTypes.string,
    hasPermission: PropTypes.func,
    organization: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number
    })
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
  isCreatingPrivilegedComment: PropTypes.bool.isRequired
};

export default CreditTransferDetails;
