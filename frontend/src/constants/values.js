export const STATUS_NEW = 'New'
export const STATUS_DRAFT = 1
export const STATUS_PROPOSED = 2
export const STATUS_ACCEPTED = 3
export const STATUS_RECOMMENDED = 4
export const STATUS_APPROVED = 6
export const STATUS_COMPLETED = 7
export const STATUS_CANCELLED = 8
export const STATUS_REJECTED = 9
export const COMPLIANCE_YEAR = 2023
export const LCFS_COMPLIANCE_START_DT = new Date('2024-01-01T00:00:01')

export const CREDIT_TRANSFER_STATUS = {
  new: {
    id: 0,
    description: 'New'
  },
  draft: {
    id: 1,
    description: 'Draft'
  },
  proposed: {
    id: 2,
    description: 'Sent'
  },
  accepted: {
    id: 3,
    description: 'Submitted'
  },
  recommendedForDecision: {
    id: 4,
    description: 'Reviewed' /* Whether it's recommended or not, the user doesn't need to know this */
  },
  notRecommended: {
    id: 5,
    description: 'Reviewed' /* Whether it's recommended or not, the user doesn't need to know this */
  },
  recorded: {
    id: 6,
    description: 'Recorded'
  },
  approved: {
    id: 7,
    description: 'Approved'
  },
  deleted: {
    id: 8,
    description: 'Deleted'
  },
  declinedForApproval: {
    id: 9,
    description: 'Declined'
  },
  refused: {
    id: 10,
    description: 'Refused'
  },
  rescinded: {
    id: 11,
    description: 'Rescinded'
  },
  updated: {
    id: 12,
    description: 'Updated'
  }
}

export const CREDIT_TRANSFER_TYPES = {
  sell: {
    id: 1
  },
  buy: {
    id: 2
  },
  validation: {
    id: 3
  },
  retirement: {
    id: 4
  },
  part3Award: {
    id: 5
  },
  adminAdjustment: {
    id: 6
  }
}

export const STATUS_ACTIVE = 'Active'
export const STATUS_ARCHIVED = 'Archived'

export const COMPLIANCE_YEAR_START = 1975

export const DEFAULT_INITIATOR = 'BC Government'

export const DEFAULT_ORGANIZATION = {
  id: 1,
  name: 'Government of British Columbia'
}

export const ADD_COMMAS_REGEX = /\B(?=(\d{3})+(?!\d))/g

export const ZERO_DOLLAR_REASON = {
  affiliate: {
    id: 1,
    description: 'Affiliate',
    formButtonDescription: 'Transfer to affiliated organization',
    textRepresentationDescription: ' it is a transfer between affiliated organizations.'
  },
  other: {
    id: 2,
    description: 'Other',
    formButtonDescription: 'Other (specify in comments)',
    textRepresentationDescription: ' reason specified in comments.'
  }
}
