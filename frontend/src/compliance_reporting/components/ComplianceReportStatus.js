import PropTypes from 'prop-types';

const ComplianceReportStatus = (props) => {
  if (props.status.directorStatus === 'Accepted') {
    return 'Accepted';
  }

  if (props.status.directorStatus === 'Rejected') {
    return 'Rejected';
  }

  if (props.status.managerStatus === 'Recommended') {
    return 'Recommended Acceptance - Manager';
  }

  if (props.status.managerStatus === 'Not Recommended') {
    return 'Recommended Rejection - Manager';
  }

  if (props.status.analystStatus === 'Recommended') {
    return 'Recommended Acceptance - Analyst';
  }

  if (props.status.analystStatus === 'Not Recommended') {
    return 'Recommended Rejection - Analyst';
  }

  if (props.status.fuelSupplierStatus) {
    return props.status.fuelSupplierStatus;
  }

  return props.status;
};

ComplianceReportStatus.propTypes = {
  status: PropTypes.shape().isRequired
};

export default ComplianceReportStatus;
