const GOVERNMENT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'PVR_CREATED',
  description: 'Save Draft',
  key: 'draft',
  recipients: ['government']
}, {
  id: 4,
  code: 'PVR_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommend Approve',
  key: 'recommended',
  recipients: ['government']
}, {
  id: 11,
  code: 'PVR_RESCINDED',
  description: 'Rescind',
  key: 'rescinded',
  recipients: ['government']
}, {
  id: 7,
  code: 'PVR_APPROVED',
  description: 'Approve',
  key: 'approved',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 9,
  code: 'PVR_DECLINED',
  description: 'Decline',
  key: 'declined',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 1,
  code: 'PVR_PULLED_BACK',
  description: 'Return to Analyst',
  key: 'return_to_analyst',
  recipients: ['government']
}, {
  id: 1,
  code: 'PVR_RETURNED_TO_ANALYST',
  description: 'Returned to Analyst',
  key: 'return_to_analyst',
  recipients: ['government']
}];

export default GOVERNMENT_TRANSFER_NOTIFICATIONS;
