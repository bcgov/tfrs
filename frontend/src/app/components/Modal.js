import React from 'react';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const bootstrapClassFor = (extraConfirmType) => {
  switch (extraConfirmType) {
    case 'warning':
      return 'alert alert-warning';
    case 'error':
      return 'alert alert-danger';
    case 'info':
    default:
      return 'alert alert-primary';
  }
};

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
          {props.showExtraConfirm &&
          <div className={bootstrapClassFor(props.extraConfirmType)}>
            {props.extraConfirmText}
          </div>
          }
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
          {props.showConfirmButton &&
          <button
            id="modal-yes"
            type="button"
            className="btn btn-primary"
            data-dismiss="modal"
            disabled={!((!props.showExtraConfirm) || props.canBypassExtraConfirm)}
            onClick={props.handleSubmit}
          >
            {props.confirmLabel}
          </button>
          }
        </div>
      </div>
    </div>
  </div>
);

Modal.defaultProps = {
  cancelLabel: Lang.BTN_NO,
  confirmLabel: Lang.BTN_YES,
  handleSubmit: null,
  showConfirmButton: true,
  showExtraConfirm: false,
  canBypassExtraConfirm: true,
  extraConfirmType: 'info',
  extraConfirmText: '',
  title: 'Confirmation'
};

Modal.propTypes = {
  cancelLabel: PropTypes.string,
  canBypassExtraConfirm: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  confirmLabel: PropTypes.string,
  extraConfirmText: PropTypes.string,
  extraConfirmType: PropTypes.oneOf([
    'info', 'warning', 'error'
  ]),
  handleSubmit: PropTypes.func,
  id: PropTypes.string.isRequired,
  showConfirmButton: PropTypes.bool,
  showExtraConfirm: PropTypes.bool,
  title: PropTypes.string
};

export default Modal;
