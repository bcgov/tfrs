import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as Lang from '../../constants/langEnUs';
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';
import history from '../../app/History';
import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';

const CreditTransferFormButtons = props => (
  <div className="credit-transfer-actions">
    <div className="btn-container">
      <button
        className="btn btn-default"
        onClick={() => history.goBack()}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
      </button>
      {props.actions.includes(Lang.BTN_DELETE_DRAFT) &&
      <button
        className="btn btn-danger"
        data-target="#confirmDelete"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_EDIT_DRAFT) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting}
        title={Lang.TEXT_COMMENT_DIRTY}
      >
        <button
          className="btn btn-default"
          disabled={props.isCommenting}
          onClick={() => history.push(CREDIT_TRANSACTIONS.EDIT.replace(':id', props.id))}
          type="button"
        >
          <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT_DRAFT}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_EDIT_PVR_DRAFT) &&
        <button
          className="btn btn-default"
          onClick={() => history.push(CREDIT_TRANSACTIONS.EDIT.replace(':id', props.id))}
          type="button"
        >
          <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT_DRAFT}
        </button>
      }
      {props.actions.includes(Lang.BTN_SAVE_DRAFT) &&
      <button
        className="btn btn-default"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.draft)}
        type="submit"
      >
        <FontAwesomeIcon icon="save" /> {Lang.BTN_SAVE_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_SIGN_1_2) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting || props.disabled.BTN_SIGN_1_2}
        title={props.isCommenting ? Lang.TEXT_COMMENT_DIRTY : (props.permissions.BTN_SIGN_1_2
          ? 'Signing Authority Declaration needs to be accepted'
          : 'You must be assigned the Signing Authority role in order to sign and send ' +
          'a Credit Transfer Proposal to another fuel supplier')}
      >
        <button
          id="credit-transfer-sign"
          className={`btn ${props.disabled.BTN_SIGN_1_2 ? 'btn-disabled' : 'btn-primary '}`}
          data-placement="right"
          data-target="#confirmSubmit"
          data-toggle="modal"
          disabled={props.disabled.BTN_SIGN_1_2}
          type="button"
        >
          <FontAwesomeIcon icon="pen-fancy" /> {Lang.BTN_SIGN_1_2}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_REFUSE) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting}
        title={Lang.TEXT_COMMENT_DIRTY}
      >
        <button
          className="btn btn-danger"
          disabled={props.isCommenting}
          data-target="#confirmRefuse"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="ban" /> {Lang.BTN_REFUSE}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_SIGN_2_2) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting || props.disabled.BTN_SIGN_2_2}
        title={props.isCommenting ? Lang.TEXT_COMMENT_DIRTY : (props.permissions.BTN_SIGN_2_2
          ? 'Signing Authority Declaration needs to be accepted'
          : 'You must be assigned the Signing Authority role in order to sign and send ' +
          'a Credit Transfer Proposal to the Low Carbon Fuels Branch')}
      >
        <button
          id="credit-transfer-accept"
          className="btn btn-primary"
          data-target="#confirmAccept"
          data-toggle="modal"
          disabled={props.disabled.BTN_SIGN_2_2}
          type="button"
        >
          <FontAwesomeIcon icon="pen-fancy" /> {Lang.BTN_SIGN_2_2}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_RESCIND) &&
      <button
        className="btn btn-danger"
        data-target="#confirmRescind"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="undo" /> {Lang.BTN_RESCIND}
      </button>
      }
      {props.actions.includes(Lang.BTN_NOT_RECOMMENDED_FOR_DECISION) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting}
        title={Lang.TEXT_COMMENT_DIRTY}
      >
        <button
          className="btn btn-danger"
          disabled={props.isCommenting}
          data-target="#confirmNotRecommend"
          data-toggle="modal"
          type="button"
        >
          {Lang.BTN_NOT_RECOMMENDED_FOR_DECISION}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_RECOMMEND_FOR_DECISION) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting || props.disabled.BTN_RECOMMEND}
        title={props.isCommenting ? Lang.TEXT_COMMENT_DIRTY : Lang.TEXT_COMMENT_REQUIRED}
      >
        <button
          id="credit-transfer-recommend"
          className={`btn ${props.disabled.BTN_RECOMMEND ? 'btn-disabled' : 'btn-primary '}`}
          disabled={props.isCommenting || props.disabled.BTN_RECOMMEND}
          data-target="#confirmRecommend"
          data-toggle="modal"
          type="button"
        >
          {Lang.BTN_RECOMMEND_FOR_DECISION}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_PULL_BACK) &&
        <button
          className="btn btn-danger"
          data-target="#confirmPullBack"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="hand-rock" /> {Lang.BTN_PULL_BACK}
        </button>
      }
      {props.actions.includes(Lang.BTN_RETURN_TO_DRAFT) &&
        <button
          className="btn btn-warning"
          data-target="#confirmReturn"
          data-toggle="modal"
          type="button"
        >
          {Lang.BTN_RETURN_TO_DRAFT}
        </button>
      }
      {props.actions.includes(Lang.BTN_DECLINE_FOR_APPROVAL) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting}
        title={Lang.TEXT_COMMENT_DIRTY}
      >
        <button
          className="btn btn-danger"
          disabled={props.isCommenting}
          data-target="#confirmDecline"
          data-toggle="modal"
          type="button"
        >
          {Lang.BTN_DECLINE_FOR_APPROVAL}
        </button>
      </TooltipWhenDisabled>
      }
      {props.actions.includes(Lang.BTN_APPROVE) &&
      <TooltipWhenDisabled
        disabled={props.isCommenting}
        title={Lang.TEXT_COMMENT_DIRTY}
      >
        <button
          id="credit-transfer-approve"
          className="btn btn-primary"
          disabled={props.isCommenting}
          data-target="#confirmApprove"
          data-toggle="modal"
          type="button"
        >
          {Lang.BTN_APPROVE}
        </button>
      </TooltipWhenDisabled>
      }
    </div>
  </div>
);

CreditTransferFormButtons.defaultProps = {
  addComment: null,
  disabled: {
    BTN_RECOMMEND: false,
    BTN_SIGN_1_2: true,
    BTN_SIGN_2_2: true
  },
  isCommenting: false,
  permissions: {
    BTN_SIGN_1_2: false,
    BTN_SIGN_2_2: false
  }
};

CreditTransferFormButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  addComment: PropTypes.func,
  changeStatus: PropTypes.func.isRequired,
  disabled: PropTypes.shape({
    BTN_RECOMMEND: PropTypes.bool,
    BTN_SIGN_1_2: PropTypes.bool,
    BTN_SIGN_2_2: PropTypes.bool
  }),
  id: PropTypes.number.isRequired,
  isCommenting: PropTypes.bool,
  permissions: PropTypes.shape({
    BTN_SIGN_1_2: PropTypes.bool,
    BTN_SIGN_2_2: PropTypes.bool
  })
};

export default CreditTransferFormButtons;
