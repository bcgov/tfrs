import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const ModalDeleteCreditTransfer = props => (
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
            data-dismiss="modal"
            onClick={() => props.deleteCreditTransfer(props.selectedId)}
          >
            {Lang.BTN_DELETE}
          </button>
        </div>
      </div>
    </div>
  </div>
);

ModalDeleteCreditTransfer.defaultProps = {
  deleteCreditTransfer: null,
  selectedId: 0
};

ModalDeleteCreditTransfer.propTypes = {
  deleteCreditTransfer: PropTypes.func,
  selectedId: PropTypes.number
};

export default ModalDeleteCreditTransfer;
