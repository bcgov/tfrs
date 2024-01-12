const GOVERNMENT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'PVR_CREATED',
  description: 'Draft Saved',
  key: 'draft',
  recipients: ['government']
}, {
  id: 4,
  code: 'PVR_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommended issuance',
  key: 'recommended',
  recipients: ['government']
}, {
  id: 11,
  code: 'PVR_RESCINDED',
  description: 'Deleted',
  key: 'rescinded',
  recipients: ['government']
}, {
  id: 7,
  code: 'PVR_APPROVED',
  description: 'Credit issuance',
  key: 'approved',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 9,
  code: 'PVR_DECLINED',
  description: 'Declined to issue',
  key: 'declined',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 1,
  code: 'PVR_PULLED_BACK',
  description: 'Recalled as draft',
  key: 'recalled_as_draft',
  recipients: ['government']
}, {
  id: 1,
  code: 'PVR_RETURNED_TO_ANALYST',
  description: 'Returned to Analyst',
  key: 'return_to_analyst',
  recipients: ['government']
}]

export default GOVERNMENT_TRANSFER_NOTIFICATIONS
