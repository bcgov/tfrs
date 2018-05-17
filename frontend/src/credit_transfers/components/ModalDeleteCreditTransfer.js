import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../app/components/Modal';

const ModalDeleteCreditTransfer = props => (
  <Modal
    handleSubmit={props.handleSubmit}
    id="confirmDelete"
    key="confirmDelete"
  >
    Do you want to delete this draft?
  </Modal>
);

ModalDeleteCreditTransfer.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default ModalDeleteCreditTransfer;
