import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import * as Lang from '../../constants/langEnUs';

const CallableModal = props => (
  <Modal
    show={props.show}
    id={props.id}
  >
    <Modal.Header className="modal-header">
      <button
        type="button"
        className="close"
        aria-label="Close"
        onClick={props.close}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <Modal.Title className="modal-title">
        {props.title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="modal-body">
      {props.children}
    </Modal.Body>
    <Modal.Footer className="modal-footer">
      <button
        className="btn btn-default"
        data-dismiss="modal"
        onClick={props.close}
        type="button"
      >
        {props.cancelLabel}
      </button>
      <button
        className="btn btn-primary"
        data-dismiss="modal"
        id="modal-yes"
        onClick={props.handleSubmit}
        type="button"
      >
        {props.confirmLabel}
      </button>
    </Modal.Footer>
  </Modal>
);

CallableModal.defaultProps = {
  cancelLabel: Lang.BTN_NO,
  confirmLabel: Lang.BTN_YES,
  handleSubmit: null,
  title: 'Confirmation'
};

CallableModal.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  close: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  handleSubmit: PropTypes.func,
  id: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string
};

export default CallableModal;
