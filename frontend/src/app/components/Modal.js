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

class Modal extends React.Component {
  componentDidMount () {
    if (this.props.initiallyShown) {
      this.show();
    }

    if (this.props.handleCancel) {
      $(this.element).on('hidden.bs.modal', (e) => {
        this.props.handleCancel();
      });
    }
  }

  show () {
    $(this.element).modal('show');
  }

  render () {
    return (
      <div
        className="modal fade"
        id={this.props.id}
        ref={element => (this.element = element)}
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
                {this.props.title}
              </h4>
            </div>
            <div className="modal-body">
              {this.props.showExtraConfirm &&
              <div className={bootstrapClassFor(this.props.extraConfirmType)}>
                {this.props.extraConfirmText}
              </div>
              }
              {this.props.children}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                {this.props.cancelLabel}
              </button>
              {this.props.showConfirmButton &&
              <button
                id="modal-yes"
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                disabled={!((!this.props.showExtraConfirm) || this.props.canBypassExtraConfirm) ||
                  this.props.disabled}
                onClick={this.props.handleSubmit}
              >
                {this.props.confirmLabel}
              </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  cancelLabel: Lang.BTN_NO,
  confirmLabel: Lang.BTN_YES,
  disabled: false,
  handleSubmit: null,
  handleCancel: null,
  showConfirmButton: true,
  showExtraConfirm: false,
  canBypassExtraConfirm: true,
  extraConfirmType: 'info',
  extraConfirmText: '',
  title: 'Confirmation',
  initiallyShown: false
};

Modal.propTypes = {
  cancelLabel: PropTypes.string,
  canBypassExtraConfirm: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  confirmLabel: PropTypes.string,
  disabled: PropTypes.bool,
  extraConfirmText: PropTypes.string,
  extraConfirmType: PropTypes.oneOf([
    'info', 'warning', 'error'
  ]),
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  id: PropTypes.string.isRequired,
  showConfirmButton: PropTypes.bool,
  showExtraConfirm: PropTypes.bool,
  title: PropTypes.string,
  initiallyShown: PropTypes.bool
};

export default Modal;
