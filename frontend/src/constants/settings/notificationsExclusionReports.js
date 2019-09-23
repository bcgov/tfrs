const EXCLUSION_REPORTS_NOTIFICATIONS = [{
  id: 1,
  code: 'EXCLUSION_REPORT_DRAFT',
  description: 'Draft Saved',
  key: 'draft',
  recipients: ['fuel_supplier']
}, {
  id: 2,
  code: 'EXCLUSION_REPORT_SUBMITTED',
  description: 'Submitted',
  key: 'submitted',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 3,
  code: 'EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST',
  description: 'Recommended Acceptance - Analyst',
  key: 'recommended-acceptance-analyst',
  recipients: ['government']
}, {
  id: 4,
  code: 'EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST',
  description: 'Recommended Rejection - Analyst',
  key: 'recommended-rejection-analyst',
  recipients: ['government']
}, {
  id: 5,
  code: 'EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER',
  description: 'Recommended Acceptance - Rejection',
  key: 'recommended-acceptance-manager',
  recipients: ['government']
}, {
  id: 6,
  code: 'EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER',
  description: 'Recommended Acceptance - Rejection',
  key: 'recommended-rejection-manager',
  recipients: ['government']
}, {
  id: 7,
  code: 'EXCLUSION_REPORT_REQUESTED_SUPPLEMENTAL',
  description: 'Requested Supplemental',
  key: 'requested-supplemental',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 8,
  code: 'EXCLUSION_REPORT_ACCEPTED',
  description: 'Accepted',
  key: 'accepted',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 9,
  code: 'EXCLUSION_REPORT_REJECTED',
  description: 'Rejected',
  key: 'rejected',
  recipients: ['fuel_supplier', 'government']
}];

export default EXCLUSION_REPORTS_NOTIFICATIONS;
