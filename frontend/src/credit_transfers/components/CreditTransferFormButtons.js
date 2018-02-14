import React from 'react';
import PropTypes from 'prop-types';

import * as Routes from '../../constants/routes';
import { CREDIT_TRANSFER_STATUS } from '../../constants/values';
import history from '../../app/History';

const CreditTransferFormButtons = props => (
  <div className="credit-transfer-actions">
    <div className="btn-container">
      <button
        type="button"
        className="btn btn-default"
        onClick={() => history.push(Routes.CREDIT_TRANSACTIONS)}
      >
        Cancel
      </button>
      {props.actions.includes('Delete') &&
      <button
        type="button"
        className="btn btn-danger"
        data-toggle="modal"
        data-target="#confirmDelete"
      >
        Delete
      </button>
      }
      {props.actions.includes('Edit Draft') &&
      <button
        type="submit"
        className="btn btn-default"
        onClick={() => history.push(Routes.CREDIT_TRANSACTION_EDIT.replace(':id', props.id))}
      >
        Edit Draft
      </button>
      }
      {props.actions.includes('Save Draft') &&
      <button
        type="submit"
        className="btn btn-default"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.draft)}
      >
        Save Draft
      </button>
      }
      {props.actions.includes('Propose') &&
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => props.changeStatus(CREDIT_TRANSFER_STATUS.proposed)}
      >
        Propose
      </button>
      }
    </div>
    {props.actions.includes('Delete') &&
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
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => props.deleteCreditTransfer(props.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    }
  </div>
);

CreditTransferFormButtons.propTypes = {
  id: PropTypes.number.isRequired,
  changeStatus: PropTypes.func.isRequired,
  deleteCreditTransfer: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CreditTransferFormButtons;
