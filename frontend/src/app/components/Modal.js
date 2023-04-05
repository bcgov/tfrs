import React from "react";
import PropTypes from "prop-types";
import { Modal as RModal } from "react-bootstrap";

import Tooltip from "../../app/components/Tooltip";
import * as Lang from "../../constants/langEnUs";

const bootstrapClassFor = (extraConfirmType) => {
  switch (extraConfirmType) {
    case "warning":
      return "alert alert-warning";
    case "error":
      return "alert alert-danger";
    case "info":
    default:
      return "alert alert-primary";
  }
};

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.handleCloseModal = this._handleCloseModal.bind(this)
  }

  componentDidMount() {
    if (this.props.initiallyShown) {
      this.show();
    }
    document.addEventListener("click", (e) => {
      const targetedId = e.target.getAttribute("data-target")?.slice(1);
      if (targetedId === this.props.id) {
        this.setState({ show: true });
      }
    });
  }
  componentWillUnmount() {
    document.removeEventListener('click',this._handleCloseModal.bind(this), false )
  }
  _handleCloseModal () {
    this.setState({show: false})
    if(this.props.handleCancel){
      this.props.handleCancel()
    }
  }

  show() {
    this.setState({ show: true });
  }

  render() {
    return (
      <RModal
        id={this.props.id}
        ref={(element) => (this.element = element)}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="confirmSubmitLabel"
        show={this.state.show}
        onHide={this.handleCloseModal}
      >
        <RModal.Header>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={this.handleCloseModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <RModal.Title id="confirmSubmitLabel">
            {this.props.title}
          </RModal.Title>
        </RModal.Header>
        <RModal.Body>
          {this.props.showExtraConfirm && (
            <div className={bootstrapClassFor(this.props.extraConfirmType)}>
              {this.props.extraConfirmText}
            </div>
          )}
          {this.props.children}
        </RModal.Body>
        <RModal.Footer>
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.handleCloseModal}
          >
            {this.props.cancelLabel}
          </button>
          {this.props.showConfirmButton && (
            <Tooltip
              show={this.props.disabled}
              title={this.props.tooltipMessage}
            >
              <button
                id="modal-yes"
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                disabled={
                  !(
                    !this.props.showExtraConfirm ||
                    this.props.canBypassExtraConfirm
                  ) || this.props.disabled
                }
                onClick={this.props.handleSubmit}
              >
                {this.props.confirmLabel}
              </button>
            </Tooltip>
          )}
        </RModal.Footer>
      </RModal>
    );
  }
}

Modal.defaultProps = {
  canBypassExtraConfirm: true,
  cancelLabel: Lang.BTN_NO,
  confirmLabel: Lang.BTN_YES,
  disabled: false,
  extraConfirmText: "",
  extraConfirmType: "info",
  handleCancel: null,
  handleSubmit: null,
  initiallyShown: false,
  showConfirmButton: true,
  showExtraConfirm: false,
  title: "Confirmation",
  tooltipMessage: "",
};

Modal.propTypes = {
  cancelLabel: PropTypes.string,
  canBypassExtraConfirm: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  confirmLabel: PropTypes.string,
  disabled: PropTypes.bool,
  extraConfirmText: PropTypes.string,
  extraConfirmType: PropTypes.oneOf(["info", "warning", "error"]),
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  id: PropTypes.string.isRequired,
  initiallyShown: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  showExtraConfirm: PropTypes.bool,
  title: PropTypes.string,
  tooltipMessage: PropTypes.string,
};

export default Modal;
