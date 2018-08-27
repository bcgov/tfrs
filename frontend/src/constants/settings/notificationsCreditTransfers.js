const CREDIT_TRANSFER_NOTIFICATIONS = [{
  id: 1,
  code: 'CREDIT_TRANSFER_CREATED',
  description: 'Draft',
  key: 'draft'
}, {
  id: 2,
  code: 'CREDIT_TRANSFER_SIGNED_1OF2',
  description: 'Signed 1/2',
  key: 'submitted'
}, {
  id: 10,
  code: 'CREDIT_TRANSFER_PROPOSAL_REFUSED',
  description: 'Refused',
  key: 'refused'
}, {
  id: 3,
  code: 'CREDIT_TRANSFER_SIGNED_2OF2',
  description: 'Signed 2/2',
  key: 'accepted'
}, {
  id: 4,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL',
  description: 'Recommended',
  key: 'recommended'
}, {
  id: 5,
  code: 'CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION',
  description: 'Not Recommended',
  key: 'not_recommended'
}, {
  id: 7,
  code: 'CREDIT_TRANSFER_APPROVED',
  description: 'Approved',
  key: 'approved'
}, {
  id: 9,
  code: 'CREDIT_TRANSFER_DECLINED',
  description: 'Declined',
  key: 'declined'
}, {
  id: 11,
  code: 'CREDIT_TRANSFER_RESCINDED',
  description: 'Rescinded',
  key: 'rescinded'
}];

export default CREDIT_TRANSFER_NOTIFICATIONS;
