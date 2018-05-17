import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const ModalSubmitCreditTransfer = props => (
  <div
    className="modal fade"
    id={props.id}
    tabIndex="-1"
    role="dialog"
    aria-labelledby="confirmSubmitLabel"
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
            id="confirmSubmitLabel"
          >
            Confirm Submission
          </h4>
        </div>
        <div className="modal-body">
          {props.message}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
          >
            {Lang.BTN_NO}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-dismiss="modal"
            onClick={props.submitCreditTransfer}
          >
            {Lang.BTN_YES}
          </button>
        </div>
      </div>
    </div>
  </div>
);

ModalSubmitCreditTransfer.defaultProps = {
  submitCreditTransfer: null,
  message: 'Do you want to sign and send this document to the other party named in this transfer?'
};

ModalSubmitCreditTransfer.propTypes = {
  id: PropTypes.string.isRequired,
  submitCreditTransfer: PropTypes.func,
  message: PropTypes.string
};

export default ModalSubmitCreditTransfer;
