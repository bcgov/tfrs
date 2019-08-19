import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import AutosaveNotifier from './AutosaveNotifier';

const prettyPrint = (messages, validationInProgress) => {
  const result = [];

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
    Object.keys(m).map((el) => {
      if (typeof m[el] === 'string') {
        result.push(`${prefix} - ${m[el]}`);
      } else {
        mapToResult(m[el], `${prefix}.${el}`);
      }
    });
  };

  mapToResult(messages, '');

  return result;
};

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
      {props.submit && [
        <TooltipWhenDisabled
          disabled={props.validating || !props.valid}
          key="btn-save"
          title={prettyPrint(props.validationMessages, props.validating)}
        >
          <button
            className="btn btn-primary"
            data-target="#confirmSave"
            data-toggle="modal"
            disabled={props.validating || !props.valid}
            type="button"
          >
            <FontAwesomeIcon icon="save" /> Save
          </button>
        </TooltipWhenDisabled>,
        <TooltipWhenDisabled
          disabled={!props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.SIGN)}
          key="btn-submit"
          title={
            !props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.SIGN)
              ? 'You must have the Signing Authority role to submit a Compliance Report to the Government of British Columbia.'
              : ''
          }
        >
          <button
            className="btn btn-primary"
            data-target="#confirmSubmit"
            data-toggle="modal"
            disabled={!props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.SIGN)}
            type="button"
          >
            <FontAwesomeIcon icon="pen-fancy" /> {Lang.BTN_SUBMIT}
          </button>
        </TooltipWhenDisabled>
      ]}
      {props.recommend &&
      props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.ANALYST_RECOMMEND_REJECTION) &&
        <button
          className="btn btn-danger"
          data-target="#confirmAnalystRecommendRejection"
          data-toggle="modal"
          key="btn-analyst-recommend-rejection"
          type="button"
        >
          <FontAwesomeIcon icon="times" /> {Lang.BTN_RECOMMEND_FOR_REJECTION}
        </button>
      }
      {props.recommend &&
      props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.ANALYST_RECOMMEND_ACCEPTANCE) &&
        <button
          className="btn btn-primary"
          data-target="#confirmAnalystRecommendAcceptance"
          data-toggle="modal"
          key="btn-analyst-recommend-acceptance"
          type="button"
        >
          <FontAwesomeIcon icon="check" /> {Lang.BTN_RECOMMEND_FOR_ACCEPTANCE}
        </button>
      }
      {props.managerRecommend &&
      props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.MANAGER_RECOMMEND_REJECTION) &&
        <button
          className="btn btn-danger"
          data-target="#confirmManagerRecommendRejection"
          data-toggle="modal"
          key="btn-manager-recommend-rejection"
          type="button"
        >
          <FontAwesomeIcon icon="times" /> {Lang.BTN_RECOMMEND_FOR_REJECTION}
        </button>
      }
      {props.managerRecommend &&
      props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.MANAGER_RECOMMEND_ACCEPTANCE) &&
        <button
          className="btn btn-primary"
          data-target="#confirmManagerRecommendAcceptance"
          data-toggle="modal"
          key="btn-manager-recommend-acceptance"
          type="button"
        >
          <FontAwesomeIcon icon="check" /> {Lang.BTN_RECOMMEND_FOR_ACCEPTANCE}
        </button>
      }
    </div>
  </div>
);

ScheduleButtons.defaultProps = {
  delete: false,
  managerRecommend: false,
  recommend: false,
  submit: false
};

ScheduleButtons.propTypes = {
  delete: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  managerRecommend: PropTypes.bool,
  recommend: PropTypes.bool,
  submit: PropTypes.bool,
  saving: PropTypes.bool.isRequired,
  validating: PropTypes.bool,
  valid: PropTypes.bool,
  validationMessages: PropTypes.object
};

export default ScheduleButtons;
