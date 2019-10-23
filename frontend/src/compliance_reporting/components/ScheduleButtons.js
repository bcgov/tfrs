import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport';
import COMPLIANCE_REPORTING from '../../constants/routes/ComplianceReporting';
import AutosaveNotifier from './AutosaveNotifier';

const getValidationMessages = (props) => {
  if (!props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.SIGN)) {
    return 'You must have the Signing Authority role to submit a Compliance Report to the Government of British Columbia.';
  }

  if (!props.valid) {
    return 'Please fix validation errors before submitting.';
  }

  if (props.tab !== 'schedule-summary') {
    return 'You can only submit this report in the Summary and Declaration tab.';
  }

  if (props.validating || props.complianceReports.isFinding) {
    return 'Validating...';
  }

  const found = props.complianceReports.items.findIndex(item => (
    item.status.fuelSupplierStatus === 'Submitted' &&
    item.compliancePeriod.description === props.compliancePeriod
  ));

  if (found >= 0) {
    return `A Compliance/Exclusion Report for ${props.compliancePeriod} has already been submitted
      to the Government of British Columbia. If the information in the previous report does not
      completely and accurately disclose the information required to be included in the report,
      please create a supplemental report by opening the previous report and clicking on the
      "Create Supplemental Report" button.`;
  }

  return '';
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
      {props.actions.includes('CREATE_SUPPLEMENTAL') &&
      <button
        className="btn btn-primary"
        data-target="#confirmCreateSupplemental"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="clone" /> {Lang.BTN_CREATE_SUPPLEMENTAL}
      </button>
      }
      {props.actions.includes('DELETE') &&
      <button
        className="btn btn-danger"
        data-target="#confirmDelete"
        data-toggle="modal"
        type="button"
      >
        <FontAwesomeIcon icon="minus-circle" /> {Lang.BTN_DELETE_DRAFT}
      </button>
      }
      {props.actions.includes('SUBMIT') && [
        <TooltipWhenDisabled
          disabled={props.validating || !props.valid}
          key="btn-save"
          title="Please fix validation errors before saving."
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
          disabled={getValidationMessages(props) !== ''}
          key="btn-submit"
          title={getValidationMessages(props)}
        >
          <button
            className="btn btn-primary"
            data-target="#confirmSubmit"
            data-toggle="modal"
            disabled={getValidationMessages(props) !== ''}
            type="button"
          >
            <FontAwesomeIcon icon="pen-fancy" /> {Lang.BTN_SUBMIT}
          </button>
        </TooltipWhenDisabled>
      ]}
      {props.actor === 'ANALYST' &&
      props.actions.includes('REQUEST_SUPPLEMENTAL') &&
        <button
          className="btn btn-info"
          data-target="#confirmAnalystRequestSupplemental"
          data-toggle="modal"
          key="btn-analyst-request-supplemental"
          type="button"
        >
          <FontAwesomeIcon icon="exclamation-circle" /> {Lang.BTN_REQUEST_SUPPLEMENTAL}
        </button>
      }
      {props.actor === 'ANALYST' &&
      props.actions.includes('DISCOMMEND') &&
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
      {props.actor === 'ANALYST' &&
      props.actions.includes('RECOMMEND') &&
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
      {props.actor === 'MANAGER' &&
      props.actions.includes('REQUEST_SUPPLEMENTAL') &&
        <button
          className="btn btn-info"
          data-target="#confirmManagerRequestSupplemental"
          data-toggle="modal"
          key="btn-manager-request-supplemental"
          type="button"
        >
          <FontAwesomeIcon icon="exclamation-circle" /> {Lang.BTN_REQUEST_SUPPLEMENTAL}
        </button>
      }
      {props.actor === 'MANAGER' &&
      props.actions.includes('DISCOMMEND') &&
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
      {props.actor === 'MANAGER' &&
      props.actions.includes('RECOMMEND') &&
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
      {props.actor === 'DIRECTOR' &&
      props.actions.includes('REJECT') &&
        <button
          className="btn btn-danger"
          data-target="#confirmDirectorReject"
          data-toggle="modal"
          key="btn-director-reject"
          type="button"
        >
          <FontAwesomeIcon icon="times" /> {Lang.BTN_REJECT}
        </button>
      }
      {props.actor === 'DIRECTOR' &&
      props.actions.includes('ACCEPT') &&
        <button
          className="btn btn-primary"
          data-target="#confirmDirectorAccept"
          data-toggle="modal"
          key="btn-director-accept"
          type="button"
        >
          <FontAwesomeIcon icon="check" /> {Lang.BTN_ACCEPT}
        </button>
      }
    </div>
  </div>
);

ScheduleButtons.defaultProps = {
  actions: [],
  actor: '',
  compliancePeriod: null,
  validating: false,
  valid: true,
  validationMessages: {}
};

ScheduleButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  actor: PropTypes.string,
  compliancePeriod: PropTypes.string,
  complianceReports: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape()),
    isFinding: PropTypes.bool
  }).isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  saving: PropTypes.bool.isRequired,
  tab: PropTypes.string.isRequired,
  validating: PropTypes.bool,
  valid: PropTypes.bool,
  validationMessages: PropTypes.shape()
};

export default ScheduleButtons;
