import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import history from '../../app/History';

import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports';

const ExclusionReportTabs = (props) => {
  let urls = {
    intro: EXCLUSION_REPORTS.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'intro'),
    exclusionAgreement: EXCLUSION_REPORTS.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'exclusion-agreement')
  };

  if (props.edit) {
    urls = {
      intro: EXCLUSION_REPORTS.EDIT.replace(':id', props.id).replace(':tab', 'intro'),
      exclusionAgreement: EXCLUSION_REPORTS.EDIT.replace(':id', props.id).replace(':tab', 'exclusion-agreement'),
      scheduleAssessment: EXCLUSION_REPORTS.EDIT.replace(':id', props.id).replace(':tab', 'schedule-assessment'),
      snapshot: EXCLUSION_REPORTS.SNAPSHOT.replace(':id', props.id)
    };
  }

  let showAssessment = false;
  if (props.exclusionReport && ['Accepted', 'Rejected'].indexOf(props.exclusionReport.status.directorStatus) >= 0) {
    showAssessment = true;
  }

  if (props.loggedInUser.isGovernmentUser &&
    (['Recommended', 'Not Recommended'].indexOf(props.exclusionReport.status.analystStatus) >= 0 ||
    ['Recommended', 'Not Recommended'].indexOf(props.exclusionReport.status.managerStatus) >= 0)) {
    showAssessment = true;
  }

  return (
    <ul className="schedule-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
        className={`${(props.active === 'intro') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.intro}>
          Introduction
        </Link>
      </li>
      <li
        role="presentation"
        className={`${(props.active === 'exclusion-agreement') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.exclusionAgreement}>
          Exclusion Agreement
        </Link>
      </li>
      {showAssessment &&
      <li
        role="presentation"
        className={`${(props.active === 'schedule-assessment') && 'active'}`}
      >
        <Link id="navbar-assessment" to={urls.scheduleAssessment}>
          Assessment
        </Link>
      </li>
      }
      {props.hasSnapshot &&
      <li className="snapshot-button">
        <button
          className="btn btn-default"
          type="button"
          onClick={() => {
            history.push(urls.snapshot);
          }}
        >
          <FontAwesomeIcon icon="camera" /> Submission Snapshot
        </button>
      </li>
      }
    </ul>
  );
};

ExclusionReportTabs.defaultProps = {
  compliancePeriod: null,
  exclusionReport: null,
  id: null
};

ExclusionReportTabs.propTypes = {
  active: PropTypes.string.isRequired,
  compliancePeriod: PropTypes.string,
  edit: PropTypes.bool.isRequired,
  exclusionReport: PropTypes.shape({
    status: PropTypes.shape()
  }),
  hasSnapshot: PropTypes.bool.isRequired,
  id: PropTypes.string,
  loggedInUser: PropTypes.shape({
    isGovernmentUser: PropTypes.bool
  }).isRequired
};

export default ExclusionReportTabs;
