export const STATUS_NEW = 'New';
export const STATUS_DRAFT = 1;
export const STATUS_PROPOSED = 2;
export const STATUS_ACCEPTED = 3;
export const STATUS_RECOMMENDED = 4;
export const STATUS_APPROVED = 6;
export const STATUS_COMPLETED = 7;
export const STATUS_CANCELLED = 8;
export const STATUS_REJECTED = 9;

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
    description: 'Signed 1/2'
  },
  accepted: {
    id: 3,
    description: 'Signed 2/2'
  },
  recommendedForDecision: {
    id: 4,
    description: 'Reviewed' /* Whether it's recommended or not, the user doesn't need to know this */
  },
  notRecommended: {
    id: 5,
    description: 'Reviewed' /* Whether it's recommended or not, the user doesn't need to know this */
  },
  approved: {
    id: 6,
    description: 'Approved'
  },
  completed: {
    id: 7,
    description: 'Approved' /* changed from 'Completed' because the difference is not relevant to the user */
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
  }
};

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
  }
};

export const STATUS_ACTIVE = 'Active';
export const STATUS_ARCHIVED = 'Archived';

export const COMPLIANCE_YEAR_START = 1975;

export const DEFAULT_INITIATOR = 'BC Government';

export const DEFAULT_ORGANIZATION = {
  id: 1,
  name: 'Government of British Columbia'
};

export const ADD_COMMAS_REGEX = /\B(?=(\d{3})+(?!\d))/g;

export const ZERO_DOLLAR_REASON = {
  affiliate: {
    id: 1,
    description: 'Affiliate'
  },
  other: {
    id: 2,
    description: 'Other'
  }
};
