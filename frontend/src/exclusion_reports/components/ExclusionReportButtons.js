import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import TooltipWhenDisabled from '../../app/components/TooltipWhenDisabled';
import history from '../../app/History';
import * as Lang from '../../constants/langEnUs';
import PERMISSIONS_COMPLIANCE_REPORT from '../../constants/permissions/ComplianceReport';
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
        <button
          className="btn btn-primary"
          data-target="#confirmSave"
          data-toggle="modal"
          key="btn-save"
          type="button"
        >
          <FontAwesomeIcon icon="save" /> Save
        </button>,
        <TooltipWhenDisabled
          disabled={!props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.SIGN)}
          key="btn-submit"
          title="You must have the Signing Authority role to submit an Exclusion Report to the Government of British Columbia."
        >
          <button
            className="btn btn-primary"
            data-target="#confirmSubmit"
            data-toggle="modal"
            disabled={!props.loggedInUser.hasPermission(PERMISSIONS_COMPLIANCE_REPORT.SIGN)}
            key="btn-submit"
            type="button"
          >
            <FontAwesomeIcon icon="pen-fancy" /> {Lang.BTN_SUBMIT}
          </button>
        </TooltipWhenDisabled>
      ]}
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

ExclusionReportButtons.defaultProps = {
  actions: [],
  actor: ''
};

ExclusionReportButtons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  actor: PropTypes.string,
  edit: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.shape({
    hasPermission: PropTypes.func
  }).isRequired,
  saving: PropTypes.bool.isRequired
};

export default ExclusionReportButtons;
