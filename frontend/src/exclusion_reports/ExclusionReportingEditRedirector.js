import React, {Component} from 'react';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import history from '../app/History';
import EXCLUSION_REPORTS from "../constants/routes/ExclusionReports";

const ExclusionReportingEditRedirector = (props) => {

  history.push(EXCLUSION_REPORTS.EDIT.replace(':id', props.match.params.id).replace(':tab', 'intro'));

  return null;
};

export default ExclusionReportingEditRedirector;
