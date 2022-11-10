import { useNavigate, useParams } from 'react-router';
import COMPLIANCE_REPORTING from '../constants/routes/ComplianceReporting';

const ComplianceReportingEditRedirector = (props) => {
  const navigate = useNavigate()
  const { id } = useParams()
  navigate(COMPLIANCE_REPORTING.EDIT.replace(':id', id).replace(':tab', 'intro'));

  return null;
};

export default ComplianceReportingEditRedirector;
