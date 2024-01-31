import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import * as Lang from '../../constants/langEnUs'
import CREDIT_TRANSACTIONS from '../../constants/routes/CreditTransactions'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES } from '../../constants/values'
import Tooltip from '../../app/components/Tooltip'
import { useNavigate } from 'react-router'

const CreditTransferFormButtons = props => {
  const navigate = useNavigate()

  return (
    <div className="credit-transfer-actions">
      <div className="btn-container">
        <button
          className="btn btn-default"
          onClick={() => navigate(-1)}
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
        <Tooltip
          show={props.isCommenting}
          title={Lang.TEXT_COMMENT_DIRTY}
        >
          <button
            className="btn btn-default"
            disabled={props.isCommenting}
            onClick={() => navigate(CREDIT_TRANSACTIONS.EDIT.replace(':id', props.id))}
            type="button"
          >
            <FontAwesomeIcon icon="edit" /> {Lang.BTN_EDIT_DRAFT}
          </button>
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_EDIT_PVR_DRAFT) &&
          <button
            className="btn btn-default"
            onClick={() => navigate(CREDIT_TRANSACTIONS.EDIT.replace(':id', props.id))}
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
        <Tooltip
          show={props.isCommenting || props.disabled.BTN_SIGN_1_2}
          title={props.isCommenting
            ? Lang.TEXT_COMMENT_DIRTY
            : (props.permissions.BTN_SIGN_1_2
                ? 'Signing Authority Declaration needs to be accepted'
                : 'You must be assigned the Signing Authority role in order to sign and send ' +
            'a Transfer Proposal to another fuel supplier')}
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
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_REFUSE) &&
        <Tooltip
          show={props.isCommenting}
          title={Lang.TEXT_COMMENT_DIRTY}
        >
          <button
            className="btn btn-danger"
            disabled={props.isCommenting}
            data-target="#confirmRefuse"
            data-toggle="modal"
            type="button"
          >
            <FontAwesomeIcon icon="ban" /> {Lang.BTN_REFUSE_2}
          </button>
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_SIGN_2_2) &&
        <Tooltip
          show={props.isCommenting || props.disabled.BTN_SIGN_2_2}
          title={props.isCommenting
            ? Lang.TEXT_COMMENT_DIRTY
            : (props.disabled.inactiveSupplier
                ? props.disabled.organizationName + ' is not currently recognized as an active fuel supplier in TFRS and is not permitted to buy credits. Inactive suppliers are only permitted to sell credits.'
                : (props.permissions.BTN_SIGN_2_2
                    ? 'Signing Authority Declaration needs to be accepted'
                    : 'You must be assigned the Signing Authority role in order to sign and send ' +
            'a Transfer Proposal to the Low Carbon Fuels Branch'))}
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
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_RESCIND) &&
        <button
          className="btn btn-danger"
          data-target="#confirmRescind"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="undo" /> {Lang.BTN_RESCIND_TRANSFER}
        </button>
        }
        {props.actions.includes(Lang.BTN_NOT_RECOMMENDED_FOR_DECISION) &&
        <Tooltip
          show={props.isCommenting}
          title={Lang.TEXT_COMMENT_DIRTY}
        >
          <button
            className="btn btn-danger"
            disabled={props.isCommenting}
            data-target="#confirmNotRecommend"
            data-toggle="modal"
            type="button"
          >
            {Lang.BTN_NOT_RECOMMENDED_FOR_DECISION_1_2}
          </button>
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_RECOMMEND_FOR_DECISION) &&
        <Tooltip
          show={props.isCommenting || props.disabled.BTN_RECOMMEND}
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
            {
              props.tradeType.theType === "Part 3 Award"
                ? Lang.BTN_RECOMMEND_FOR_DECISION_1_2
                : Lang.BTN_RECOMMEND_FOR_DECISION_1_3
            }
          </button>
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_PULL_BACK) &&
          <button
            className="btn btn-danger"
            data-target="#confirmPullBack"
            data-toggle="modal"
            type="button"
          >
            <FontAwesomeIcon icon="undo-alt" /> {Lang.BTN_PULL_BACK}
          </button>
        }
        {props.actions.includes(Lang.BTN_RETURN_TO_DRAFT) &&
        !props.actions.includes(Lang.BTN_PULL_BACK) &&
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
        <Tooltip
          show={props.isCommenting}
          title={Lang.TEXT_COMMENT_DIRTY}
        >
          <button
            className="btn btn-danger"
            disabled={props.isCommenting}
            data-target="#confirmDecline"
            data-toggle="modal"
            type="button"
          >
            {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(props.tradeType.id) >= 0 ? Lang.BTN_DECLINE_FOR_APPROVAL_1_2 : Lang.BTN_DECLINE_ISSUANCE}
          </button>
        </Tooltip>
        }
        {props.actions.includes(Lang.BTN_APPROVE) &&
        <Tooltip
          show={props.isCommenting}
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
            {[CREDIT_TRANSFER_TYPES.buy.id, CREDIT_TRANSFER_TYPES.sell.id].indexOf(props.tradeType.id) >= 0 ? Lang.BTN_APPROVE_1_2 : Lang.BTN_APPROVE_ISSUANCE}
          </button>
        </Tooltip>
        }
      </div>
    </div>
  )
}

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
}

CreditTransferFormButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string).isRequired,
  addComment: PropTypes.func,
  changeStatus: PropTypes.func.isRequired,
  disabled: PropTypes.shape({
    BTN_RECOMMEND: PropTypes.bool,
    BTN_SIGN_1_2: PropTypes.bool,
    BTN_SIGN_2_2: PropTypes.bool,
    organizationName: PropTypes.string,
    inactiveSupplier: PropTypes.bool
  }),
  id: PropTypes.number.isRequired,
  isCommenting: PropTypes.bool,
  permissions: PropTypes.shape({
    BTN_SIGN_1_2: PropTypes.bool,
    BTN_SIGN_2_2: PropTypes.bool
  }),
  tradeType: PropTypes.shape({
    id: PropTypes.number
  })
}

export default CreditTransferFormButtons
