import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';

const ComplianceReportingEditRedirector = (props) => {
  props.navigate(COMPLIANCE_REPORTING.EDIT.replace(':id', props.match.params.id).replace(':tab', 'intro'));

  return null;
};

export default ComplianceReportingEditRedirector;
