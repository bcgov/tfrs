import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import EXCLUSION_REPORTS from '../../constants/routes/ExclusionReports';

const ExclusionReportTabs = (props) => {
  let urls = {
    exclusionAgreement: EXCLUSION_REPORTS.ADD.replace(':period', props.compliancePeriod).replace(':tab', 'exclusion-agreement')
  };

  if (props.edit) {
    urls = {
      exclusionAgreement: EXCLUSION_REPORTS.EDIT.replace(':period', props.compliancePeriod).replace(':tab', 'exclusion-agreement')
    };
  }

  return (
    <ul className="schedule-tabs nav nav-tabs" role="tablist">
      <li
        role="presentation"
        className={`${(props.active === 'exclusion-agreement') && 'active'}`}
      >
        <Link id="navbar-administration" to={urls.exclusionAgreement}>
          Exclusion Agreement
        </Link>
      </li>
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
  id: PropTypes.string
};

export default ExclusionReportTabs;
