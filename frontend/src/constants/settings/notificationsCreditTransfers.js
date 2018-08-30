const CREDIT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'CREDIT_TRANSFER_CREATED',
  description: 'Save Draft',
  key: 'draft',
  recipients: ['fuel_supplier']
}, {
  id: 2,
  code: 'CREDIT_TRANSFER_SIGNED_1OF2',
  description: 'Sign 1/2',
  key: 'submitted',
  recipients: ['fuel_supplier']
}, {
  id: 10,
  code: 'CREDIT_TRANSFER_PROPOSAL_REFUSED',
  description: 'Refuse',
  key: 'refused',
  recipients: ['fuel_supplier']
}, {
  id: 3,
  code: 'CREDIT_TRANSFER_SIGNED_2OF2',
  description: 'Sign 2/2',
  key: 'accepted',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 4,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommend Approve',
  key: 'recommended',
  permission: 'RECOMMEND_CREDIT_TRANSFER',
  recipients: ['government']
}, {
  id: 5,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION',
  description: 'Recommend Decline',
  key: 'not_recommended',
  permission: 'RECOMMEND_CREDIT_TRANSFER',
  recipients: ['government']
}, {
  id: 7,
  code: 'CREDIT_TRANSFER_APPROVED',
  description: 'Approve',
  key: 'approved',
  permission: 'APPROVE_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 9,
  code: 'CREDIT_TRANSFER_DECLINED',
  description: 'Decline',
  key: 'declined',
  permission: 'DECLINE_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government']
}, {
  id: 11,
  code: 'CREDIT_TRANSFER_RESCINDED',
  description: 'Rescind',
  key: 'rescinded',
  permission: 'RESCIND_CREDIT_TRANSFER',
  recipients: ['fuel_supplier', 'government']
}];

export default CREDIT_TRANSFER_NOTIFICATIONS;
