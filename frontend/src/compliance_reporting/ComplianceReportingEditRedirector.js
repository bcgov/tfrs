import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import history from '../app/History';

const ComplianceReportingEditRedirector = (props) => {
  history.push(COMPLIANCE_REPORTING.EDIT.replace(':id', props.match.params.id).replace(':tab', 'intro'));

  return null;
};

export default ComplianceReportingEditRedirector;
