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
      snapshot: EXCLUSION_REPORTS.SNAPSHOT.replace(':id', props.id)
    };
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
  id: null
};

ExclusionReportTabs.propTypes = {
  active: PropTypes.string.isRequired,
  compliancePeriod: PropTypes.string,
  edit: PropTypes.bool.isRequired,
  hasSnapshot: PropTypes.bool.isRequired,
  id: PropTypes.string
};

export default ExclusionReportTabs;
