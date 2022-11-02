import { useNavigate, useParams } from 'react-router';
import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports';

const ExclusionReportingEditRedirector = (props) => {
  const navigate = useNavigate()
  const { id } = useParams()
  navigate(EXCLUSION_REPORTS.EDIT.replace(':id', id).replace(':tab', 'intro'));

  return null;
};

export default ExclusionReportingEditRedirector;
