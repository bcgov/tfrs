import EXCLUSION_REPORTS from '../constants/routes/ExclusionReports';

const ExclusionReportingEditRedirector = (props) => {
  props.navigate(EXCLUSION_REPORTS.EDIT.replace(':id', props.match.params.id).replace(':tab', 'intro'));

  return null;
};

export default ExclusionReportingEditRedirector;
