const DOCUMENT_NOTIFICATIONS = [ {
  id: 1,
  code: 'DOCUMENT_PENDING_SUBMISSION',
  description: 'File Pending Submission',
  key: 'pending',
  recipients: ['fuel_supplier']
}, {
  id: 2,
  code: 'DOCUMENT_SUBMITTED',
  description: 'File Submitted',
  key: 'submitted',
  recipients: ['fuel_supplier']
}, {
  id: 3,
  code: 'DOCUMENT_SCAN_FAILED',
  description: 'Security Scan Failed',
  key: 'failed',
  recipients: ['fuel_supplier']
}];

export default DOCUMENT_NOTIFICATIONS;
