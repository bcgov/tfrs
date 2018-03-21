import React from 'react';
import PropTypes from 'prop-types';

import * as Routes from '../../constants/routes';
import * as Lang from '../../constants/langEnUs';

import { CREDIT_TRANSFER_STATUS } from '../../constants/values';
import history from '../../app/History';

const CreditTransferFormButtons = props => (
  <div className="credit-transfer-actions">
    <div className="btn-container">
      <button
        type="button"
        className="btn btn-default"
        onClick={() => history.goBack()}
      >
        {Lang.BTN_APP_CANCEL}
      </button>
      {props.actions.includes(Lang.BTN_DELETE) &&
      <button
        type="button"
        className="btn btn-danger"
        data-toggle="modal"
        data-target="#confirmDelete"
      >
        {Lang.BTN_DELETE}
      </button>
      }
      {props.actions.includes(Lang.BTN_EDIT_DRAFT) &&
      <button
        type="button"
        className="btn btn-default"
        onClick={() => history.push(Routes.CREDIT_TRANSACTION_EDIT.replace(':id', props.id))}
      >
        {Lang.BTN_EDIT_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_SAVE_DRAFT) &&
      <button
        type="submit"
        className="btn btn-default"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.draft)}
      >
        {Lang.BTN_SAVE_DRAFT}
      </button>
      }
      {props.actions.includes(Lang.BTN_PROPOSE) &&
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.proposed)}
      >
        {Lang.BTN_PROPOSE}
      </button>
      }
      {props.actions.includes(Lang.BTN_ACCEPT) &&
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.accepted)}
      >
        {Lang.BTN_ACCEPT}
      </button>
      }
      {props.actions.includes(Lang.BTN_REFUSE) &&
      <button
        type="submit"
        className="btn btn-danger"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.refused)}
      >
        {Lang.BTN_REFUSE}
      </button>
      }
      {props.actions.includes(Lang.BTN_RESCIND) &&
      <button
        type="submit"
        className="btn btn-danger"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.rescinded)}
      >
        {Lang.BTN_RESCIND}
      </button>
      }
    </div>
    {props.actions.includes(Lang.BTN_DELETE) &&
    <div
      className="modal fade"
      id="confirmDelete"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="confirmDeleteLabel"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4
              className="modal-title"
              id="confirmDeleteLabel"
            >
              Confirm Delete
            </h4>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this credit transfer?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
            >
              {Lang.BTN_APP_CANCEL}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => props.deleteCreditTransfer(props.id)}
            >
              {Lang.BTN_DELETE}
            </button>
          </div>
        </div>
      </div>
    </div>
    }
  </div>
);

CreditTransferFormButtons.defaultProps = {
  deleteCreditTransfer: () => {}
};

CreditTransferFormButtons.propTypes = {
  id: PropTypes.number.isRequired,
  changeStatus: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CreditTransferFormButtons;
