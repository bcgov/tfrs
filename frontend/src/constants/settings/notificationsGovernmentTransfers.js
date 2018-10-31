const GOVERNMENT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'PVR_CREATED',
  description: 'Draft Saved',
  key: 'draft',
  recipients: ['government']
}, {
  id: 4,
  code: 'PVR_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommended Director Approval',
  key: 'recommended',
  recipients: ['government']
}, {
  id: 11,
  code: 'PVR_RESCINDED',
  description: 'Rescinded',
  key: 'rescinded',
  recipients: ['government']
}, {
  id: 7,
  code: 'PVR_APPROVED',
  description: 'Director Approval',
  key: 'approved',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 9,
  code: 'PVR_DECLINED',
  description: 'Director Declined to Approve',
  key: 'declined',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 1,
  code: 'PVR_PULLED_BACK',
  description: 'Returned to Analyst',
  key: 'return_to_analyst',
  recipients: ['government']
}];

export default GOVERNMENT_TRANSFER_NOTIFICATIONS;
