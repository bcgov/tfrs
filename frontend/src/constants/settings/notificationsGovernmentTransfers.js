const GOVERNMENT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'GOVERNMENT_TRANSFER_CREATED',
  description: 'Save Draft',
  key: 'draft',
  recipients: ['government']
}, {
  id: 4,
  code: 'GOVERNMENT_TRANSFER_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommend Approce',
  key: 'recommended',
  recipients: ['government']
}, {
  id: 11,
  code: 'GOVERNMENT_TRANSFER_RESCINDED',
  description: 'Rescind',
  key: 'rescinded',
  recipients: ['government']
}, {
  id: 7,
  code: 'GOVERNMENT_TRANSFER_APPROVED',
  description: 'Approve',
  key: 'approved',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 9,
  code: 'GOVERNMENT_TRANSFER_DECLINED',
  description: 'Decline',
  key: 'declined',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 1,
  code: 'GOVERNMENT_TRANSFER_CREATED',
  description: 'Return to Analyst',
  key: 'return_to_analyst',
  recipients: ['government']
}];

export default GOVERNMENT_TRANSFER_NOTIFICATIONS;
