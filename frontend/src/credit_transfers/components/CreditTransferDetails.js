/*
 * Presentational component
 */
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../../app/components/Loading';

import CreditTransferProgress from './CreditTransferProgress';
import CreditTransferTextRepresentation from './CreditTransferTextRepresentation';
import CreditTransferVisualRepresentation from './CreditTransferVisualRepresentation';
import CreditTransferFormButtons from './CreditTransferFormButtons';
import { getCreditTransferType } from '../../actions/creditTransfersActions';
import CheckBox from '../../app/components/CheckBox';

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
        <CreditTransferProgress status={props.status} type={props.tradeType} />
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
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group terms">
            <div className="check">
              <CheckBox
                field={props.terms.regulation}
                name="regulation"
                toggleCheck={props.toggleCheck}
              />
            </div>
            <div>
              I confirm that records evidencing each matter reported under section 11.11 (2) of the
              Regulation are available on request.
            </div>
          </div>

          <div className="form-group terms">
            <div className="check">
              <CheckBox
                field={props.terms.authorized}
                name="authorized"
                toggleCheck={props.toggleCheck}
              />
            </div>
            <div>
              I confirm that I am an officer or employee of the fuel supplier, and that records
              evidencing my authority to submit this proposal are available on request.
            </div>
          </div>

          <div className="form-group terms">
            <div className="check">
              <CheckBox
                field={props.terms.accurate}
                name="accurate"
                toggleCheck={props.toggleCheck}
              />
            </div>
            <div>
              I certify that the information in this report is true and complete to the best of
              my knowledge and I understand that the Director may require records evidencing the
              truth of that information.
            </div>
          </div>

          <CreditTransferFormButtons
            actions={props.buttonActions}
            changeStatus={props.changeStatus}
            disabled={
              {
                BTN_SIGN_1_2: !props.terms.accurate ||
                              !props.terms.authorized ||
                              !props.terms.regulation
              }
            }
            id={props.id}
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
  fairMarketValuePerCredit: '0',
  id: 0,
  note: '',
  numberOfCredits: '0',
  status: {
    id: 0,
    status: ''
  },
  terms: {
    accurate: false,
    authorized: false,
    regulation: false
  },
  totalValue: '0',
  tradeEffectiveDate: '',
  tradeType: {
    theType: 'sell'
  }
};

CreditTransferDetails.propTypes = {
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
  fairMarketValuePerCredit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  id: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  note: PropTypes.string,
  numberOfCredits: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  status: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string
  }),
  terms: PropTypes.shape({
    accurate: PropTypes.bool,
    authorized: PropTypes.bool,
    regulation: PropTypes.bool
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
  })
};

export default CreditTransferDetails;
