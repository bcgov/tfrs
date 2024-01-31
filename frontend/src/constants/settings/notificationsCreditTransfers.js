const CREDIT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'CREDIT_TRANSFER_CREATED',
  description: 'Draft Saved',
  key: 'draft',
  recipients: ['fuel_supplier'],
  feature: 'credit_transfer'
}, {
  id: 2,
  code: 'CREDIT_TRANSFER_SIGNED_1OF2',
  description: 'Sent',
  key: 'submitted',
  recipients: ['fuel_supplier'],
  feature: 'credit_transfer'
}, {
  id: 10,
  code: 'CREDIT_TRANSFER_PROPOSAL_REFUSED',
  description: 'Declined',
  key: 'refused',
  recipients: ['fuel_supplier'],
  feature: 'credit_transfer'
}, {
  id: 3,
  code: 'CREDIT_TRANSFER_SIGNED_2OF2',
  description: 'Submitted',
  key: 'accepted',
  recipients: ['fuel_supplier', 'government'],
  feature: 'credit_transfer'
}, {
  id: 4,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommend recording transfer',
  key: 'recommended',
  permission: 'RECOMMEND_CREDIT_TRANSFER',
  recipients: ['government'],
  feature: 'base'
}, {
  id: 5,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION',
  description: 'Recommend refusing transfer',
  key: 'not_recommended',
  permission: 'RECOMMEND_CREDIT_TRANSFER',
  recipients: ['government'],
  feature: 'base'
}, {
  id: 7,
  code: 'CREDIT_TRANSFER_APPROVED',
  description: 'Recorded',
  key: 'approved',
  permission: 'APPROVE_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government'],
  feature: 'base'
}, {
  id: 9,
  code: 'CREDIT_TRANSFER_DECLINED',
  description: 'Refused',
  key: 'declined',
  permission: 'DECLINE_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government'],
  feature: 'base'
}, {
  id: 11,
  code: 'CREDIT_TRANSFER_RESCINDED',
  description: 'Rescinded',
  key: 'rescinded',
  permission: 'RESCIND_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government'],
  feature: 'credit_transfer'
}]

export default CREDIT_TRANSFER_NOTIFICATIONS
