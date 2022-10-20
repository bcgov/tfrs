import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';
import history from '../app/History';

const ComplianceReportingEditRedirector = (props) => {
  props.navigate(COMPLIANCE_REPORTING.EDIT.replace(':id', props.match.params.id).replace(':tab', 'intro'));

  return null;
};

export default ComplianceReportingEditRedirector;
