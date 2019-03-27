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
  description: 'Signed 1/2',
  key: 'submitted',
  recipients: ['fuel_supplier'],
  feature: 'credit_transfer'
}, {
  id: 10,
  code: 'CREDIT_TRANSFER_PROPOSAL_REFUSED',
  description: 'Refused',
  key: 'refused',
  recipients: ['fuel_supplier'],
  feature: 'credit_transfer'
}, {
  id: 3,
  code: 'CREDIT_TRANSFER_SIGNED_2OF2',
  description: 'Signed 2/2',
  key: 'accepted',
  recipients: ['fuel_supplier', 'government'],
  feature: 'credit_transfer'
}, {
  id: 4,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommend Director Approval',
  key: 'recommended',
  permission: 'RECOMMEND_CREDIT_TRANSFER',
  recipients: ['government'],
  feature: 'base'
}, {
  id: 5,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION',
  description: 'Recommend Director Approval Decline',
  key: 'not_recommended',
  permission: 'RECOMMEND_CREDIT_TRANSFER',
  recipients: ['government'],
  feature: 'base'
}, {
  id: 7,
  code: 'CREDIT_TRANSFER_APPROVED',
  description: 'Director Approval',
  key: 'approved',
  permission: 'APPROVE_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government'],
  feature: 'base'
}, {
  id: 9,
  code: 'CREDIT_TRANSFER_DECLINED',
  description: 'Director Declined to Approve',
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
}];

export default CREDIT_TRANSFER_NOTIFICATIONS;
