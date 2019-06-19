import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import AutosaveNotifier from "./AutosaveNotifier";

class ScheduleButtons extends Component {
  render() {
    return [
      <div className="btn-container" key="btn-container">
        <div className="left">
          <AutosaveNotifier style="text-align: left" saving={this.props.saving}/>
        </div>

        <div className="right">
          <button
            className="btn btn-default"
            onClick={() => history.push(COMPLIANCE_REPORTING.LIST)}
            type="button"
          >
            <FontAwesomeIcon icon="arrow-circle-left"/> {Lang.BTN_APP_CANCEL}
          </button>
          {this.props.delete &&
          <button
            className="btn btn-danger"
            data-target="#confirmDelete"
            data-toggle="modal"
            type="button"
          >
            <FontAwesomeIcon icon="minus-circle"/> {Lang.BTN_DELETE_DRAFT}
          </button>
          }
          {this.props.submit &&
          <button 
            className="btn btn-primary"
            data-target="#confirmSubmit"
            data-toggle="modal"
            type="button"
          >
            <FontAwesomeIcon icon="save"/> Save
          </button>
          }
        </div>
      </div>
    ];
  }
}

ScheduleButtons.defaultProps = {
  submit: false,
  delete: false
};

ScheduleButtons.propTypes = {
  edit: PropTypes.bool.isRequired,
  delete: PropTypes.bool,
  submit: PropTypes.bool,
  saving: PropTypes.bool.isRequired
};

export default ScheduleButtons;
