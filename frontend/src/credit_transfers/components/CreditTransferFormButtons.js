import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';
import history from '../../app/History';

const CreditTransferFormButtons = props => (
  <div className="credit-transfer-actions">
    <div className="btn-container">
      <button
        className="btn btn-default"
        onClick={() => history.goBack()}
        type="button"
      >
        {Lang.BTN_APP_CANCEL}
      </button>
      {props.actions.includes(Lang.BTN_DELETE_DRAFT) &&
      <button
        className="btn btn-danger"
        data-target="#confirmDelete"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_DELETE_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_EDIT_DRAFT) &&
      <button
        className="btn btn-default"
        onClick={() => history.push(CREDIT_TRANSACTIONS.EDIT.replace(':id', props.id))}
        type="button"
      >
        {Lang.BTN_EDIT_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_SAVE_DRAFT) &&
      <button
        className="btn btn-default"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.draft)}
        type="submit"
      >
        {Lang.BTN_SAVE_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_SIGN_1_2) &&
      <button
        className={`btn ${props.disabled.BTN_SIGN_1_2 ? 'btn-disabled' : 'btn-primary '}`}
        data-target="#confirmSubmit"
        data-toggle="modal"
        disabled={props.disabled.BTN_SIGN_1_2}
        type="button"
      >
        {Lang.BTN_SIGN_1_2}
      </button>
      }
      {props.actions.includes(Lang.BTN_REFUSE) &&
      <button
        className="btn btn-danger"
        data-target="#confirmRefuse"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_REFUSE}
      </button>
      }
      {props.actions.includes(Lang.BTN_SIGN_2_2) &&
      <button
        className="btn btn-primary"
        data-target="#confirmAccept"
        data-toggle="modal"
        disabled={props.disabled.BTN_SIGN_2_2}
        type="button"
      >
        {Lang.BTN_SIGN_2_2}
      </button>
      }
      {props.actions.includes(Lang.BTN_RESCIND) &&
      <button
        className="btn btn-danger"
        data-target="#confirmRescind"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_RESCIND}
      </button>
      }
      {props.actions.includes(Lang.BTN_NOT_RECOMMENDED_FOR_DECISION) &&
      <button
        className="btn btn-danger"
        data-target="#confirmNotRecommend"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_NOT_RECOMMENDED_FOR_DECISION}
      </button>
      }
      {props.actions.includes(Lang.BTN_RECOMMEND_FOR_DECISION) &&
      <button
        className="btn btn-primary"
        data-target="#confirmRecommend"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_RECOMMEND_FOR_DECISION}
      </button>
      }
      {props.actions.includes(Lang.BTN_DECLINE_FOR_APPROVAL) &&
      <button
        className="btn btn-danger"
        data-target="#confirmDecline"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_DECLINE_FOR_APPROVAL}
      </button>
      }
      {props.actions.includes(Lang.BTN_APPROVE) &&
      <button
        className="btn btn-primary"
        data-target="#confirmApprove"
        data-toggle="modal"
        type="button"
      >
        {Lang.BTN_APPROVE}
      </button>
      }
    </div>
  </div>
);

CreditTransferFormButtons.defaultProps = {
  disabled: {
    BTN_SIGN_1_2: true,
    BTN_SIGN_2_2: true
  }
};

CreditTransferFormButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeStatus: PropTypes.func.isRequired,
  disabled: PropTypes.shape({
    BTN_SIGN_1_2: PropTypes.bool,
    BTN_SIGN_2_2: PropTypes.bool
  }),
  id: PropTypes.number.isRequired
};

export default CreditTransferFormButtons;
