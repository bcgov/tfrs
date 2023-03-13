const ComplianceReportStatus = (item) => {
  if (item.status.managerStatus === 'Requested Supplemental') {
    return 'Supplemental Requested'
  }

  if (item.status.analystStatus === 'Recommended') {
    return 'Recommended Acceptance - Analyst'
  }

  if (item.status.analystStatus === 'Not Recommended') {
    return 'Recommended Rejection - Analyst'
  }

  if (item.status.analystStatus === 'Requested Supplemental') {
    return 'Supplemental Requested'
  }
  if (item.status.analystStatus === 'Recommended') {
    return 'Recommended Acceptance - Analyst'
  }

  if (item.status.analystStatus === 'Not Recommended') {
    return 'Recommended Rejection - Analyst'
  }

  if (item.status.directorStatus === 'Accepted') {
    return 'Accepted'
  }

  if (item.status.directorStatus === 'Rejected') {
    return 'Rejected'
  }

  if (item.status.managerStatus === 'Recommended') {
    return 'Recommended Acceptance - Manager'
  }

  if (item.status.managerStatus === 'Not Recommended') {
    return 'Recommended Rejection - Manager'
  }

  if (item.status.fuelSupplierStatus) {
    return item.status.fuelSupplierStatus
  }

  return item.status
}

export default ComplianceReportStatus
