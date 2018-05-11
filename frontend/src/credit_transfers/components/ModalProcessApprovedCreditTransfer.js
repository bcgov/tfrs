import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const ModalProcessApprovedCreditTransfer = props => (
  <div
    className="modal fade"
    id="confirmProcess"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="confirmProcessLabel"
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
            id="confirmProcessLabel"
          >
            Confirm Process
          </h4>
        </div>
        <div className="modal-body">
          Are you sure you want to commit the approved credit transactions?
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
            onClick={props.processApprovedCreditTransfers}
          >
            {Lang.BTN_PROCESS}
          </button>
        </div>
      </div>
    </div>
  </div>
);

ModalProcessApprovedCreditTransfer.defaultProps = {
  selectedId: 0
};

ModalProcessApprovedCreditTransfer.propTypes = {
  processApprovedCreditTransfers: PropTypes.func.isRequired,
  selectedId: PropTypes.number
};

export default ModalProcessApprovedCreditTransfer;
