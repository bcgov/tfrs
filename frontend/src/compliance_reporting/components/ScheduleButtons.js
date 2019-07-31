import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import AutosaveNotifier from './AutosaveNotifier';
import TooltipWhenDisabled from "../../app/components/TooltipWhenDisabled";

function _prettyPrint(messages, validationInProgress)
{
  let result = [];

  if (validationInProgress) {
    result.push('Validation in progress');
    return result;
  }

  if (messages == null || Object.keys(messages).length === 0) {
    result.push('No changes to save');
    return result;
  }

  result.push('Validation errors prevent saving');

  const mapToResult = (m, prefix) => {
    Object.keys(m).map(el => {
      if (typeof m[el] === 'string') {
        result.push(`${prefix} - ${m[el]}`);
      } else {
        mapToResult(m[el], `${prefix}.${el}`)
      }
    });
  };

  mapToResult(messages, '');

  return result;
}

const ScheduleButtons = props => (
  <div className="schedule-buttons btn-container">
    <div className="left">
      <AutosaveNotifier saving={props.saving}/>
    </div>

    <div className="right">
      <button
        className="btn btn-default"
        onClick={() => history.push(COMPLIANCE_REPORTING.LIST)}
        type="button"
      >
        <FontAwesomeIcon icon="arrow-circle-left"/> {Lang.BTN_APP_CANCEL}
      </button>
      {props.delete &&
      <button
        className="btn btn-danger"
        data-target="#confirmDelete"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="minus-circle"/> {Lang.BTN_DELETE_DRAFT}
      </button>
      }
      {props.submit && [
        <TooltipWhenDisabled
          disabled={props.validating || !props.valid}
          key="btn-save"
          title={_prettyPrint(props.validationMessages, props.validating)}
        >
          <button
            className="btn btn-primary"
            data-target="#confirmSave"
            data-toggle="modal"
            type="button"
            disabled={props.validating || !props.valid}
          >
            <FontAwesomeIcon icon="save" /> Save
          </button>
        </TooltipWhenDisabled>,
        <button
          className="btn btn-primary"
          data-target="#confirmSubmit"
          data-toggle="modal"
          key="btn-submit"
          type="button"
        >
          <FontAwesomeIcon icon="pen-fancy" /> {Lang.BTN_SUBMIT}
        </button>
      ]}
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
  saving: PropTypes.bool.isRequired,
  validating: PropTypes.bool,
  valid: PropTypes.bool,
  validationMessages: PropTypes.object
};

export default ScheduleButtons;
