import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';

const ExclusionReportButtons = props => (
  <div className="exclusion-report-buttons btn-container">
    <div className="left" />
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

ExclusionReportButtons.defaultProps = {
  submit: false,
  delete: false
};

ExclusionReportButtons.propTypes = {
  edit: PropTypes.bool.isRequired,
  delete: PropTypes.bool,
  submit: PropTypes.bool,
  saving: PropTypes.bool.isRequired
};

export default ExclusionReportButtons;
