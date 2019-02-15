const DOCUMENT_NOTIFICATIONS = [{
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
  recipients: ['fuel_supplier', 'government']
}, {
  id: 3,
  code: 'DOCUMENT_SCAN_FAILED',
  description: 'Security Scan Failed',
  key: 'failed',
  recipients: ['fuel_supplier']
}, {
  id: 4,
  code: 'DOCUMENT_RECEIVED',
  description: 'Submission Received',
  key: 'received',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 5,
  code: 'DOCUMENT_ARCHIVED',
  description: 'Submission Archived',
  key: 'archived',
  recipients: ['government']
}];

export default DOCUMENT_NOTIFICATIONS;
