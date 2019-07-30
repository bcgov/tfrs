import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import AutosaveNotifier from './AutosaveNotifier';

const ScheduleButtons = props => (
  <div className="schedule-buttons btn-container">
    <div className="left">
      <AutosaveNotifier saving={props.saving} />
    </div>

    <div className="right">
      <button
        className="btn btn-default"
        onClick={() => history.push(COMPLIANCE_REPORTING.LIST)}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left" /> {Lang.BTN_APP_CANCEL}
      </button>
      {props.delete &&
      <button
        className="btn btn-danger"
        data-target="#confirmDelete"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
      </button>
      }
      {props.submit &&
      <button
        className="btn btn-primary"
        data-target="#confirmSubmit"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="save" /> Save
      </button>
      }
    </div>
  </div>
);

ScheduleButtons.defaultProps = {
  submit: false,
  delete: false
};

ScheduleButtons.propTypes = {
  delete: PropTypes.bool,
  submit: PropTypes.bool,
  saving: PropTypes.bool.isRequired
};

export default ScheduleButtons;
