import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const Modal = props => (
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
            {props.title}
          </h4>
        </div>
        <div className="modal-body">
          {props.children}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
          >
            {props.cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-dismiss="modal"
            onClick={props.handleSubmit}
          >
            {props.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
);

Modal.defaultProps = {
  cancelLabel: Lang.BTN_NO,
  confirmLabel: Lang.BTN_YES,
  handleSubmit: null,
  title: 'Confirmation'
};

Modal.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  confirmLabel: PropTypes.string,
  handleSubmit: PropTypes.func,
  id: PropTypes.string.isRequired,
  title: PropTypes.string
};

export default Modal;
