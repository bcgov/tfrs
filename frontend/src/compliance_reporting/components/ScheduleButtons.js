import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Modal from '../../app/components/Modal';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import toastr from '../../utils/toastr';

class ScheduleButtons extends Component {
  _handleDelete () {
    history.push(COMPLIANCE_REPORTING.LIST);
    toastr.complianceReporting('Cancelled');
  }

  render () {
    return [
      <div className="btn-container" key="btn-container">
        <button
          className="btn btn-default"
          onClick={() => history.push(COMPLIANCE_REPORTING.LIST)}
          type="button"
        >
          <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
        </button>
        {this.props.edit &&
        <button
          className="btn btn-danger"
          data-target="#confirmDelete"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
        </button>
        }
        {this.props.submit &&
        <button
          className="btn btn-primary"
          data-target="#confirmSubmit"
          data-toggle="modal"
          type="button"
        >
          <FontAwesomeIcon icon="save" /> Save
        </button>
        }
      </div>,
      <Modal
        handleSubmit={event => this._handleDelete(event)}
        id="confirmDelete"
        key="confirm-delete"
      >
        Are you sure you want to delete this draft?
      </Modal>
    ];
  }
}

ScheduleButtons.defaultProps = {
  submit: false
};

ScheduleButtons.propTypes = {
  edit: PropTypes.bool.isRequired,
  submit: PropTypes.bool
};

export default ScheduleButtons;
