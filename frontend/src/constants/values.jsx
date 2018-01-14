export const STATUS_NEW = "New";
export const STATUS_DRAFT = 1;
export const STATUS_PROPOSED = 2;
export const STATUS_ACCEPTED = 3;
export const STATUS_RECOMMENDED = 4;
export const STATUS_APPROVED = 6;
export const STATUS_COMPLETED = 7;
export const STATUS_CANCELLED = 8;
export const STATUS_REJECTED = 9;

export const CREDIT_TRANSFER_STATUS = {
	"new": {
		id: 0,
		description: "New",
	},
	"draft": {
		id: 1,
		description: "Draft",
	},
	"submitted": {
		id: 2,
		description: "Submitted",
	},
	"accepted": {
		id: 3,
		description: "Accepted",
	},
	"recommendedForDecision": {
		id: 4,
		description: "Recommended for decision",
	},
	"notRecommended": {
		id: 5,
		description: "Not Recommended",
	},
	"approved": {
		id: 6,
		description: "Approved",
	},
	"completed": {
		id: 7,
		description: "Completed",
	},
	"rescinded": {
		id: 8,
		description: "Rescinded",
	},
	"declinedForApproval": {
		id: 9,
		description: "Declined for approval",
	},
}

export const CREDIT_TRANSFER_TYPES = {
	"sell": {
		id: 1,
	},
	"buy": {
		id: 2
	},
	"validation": {
		id: 3
	},
	"retirement": {
		id: 4
	},
	"part3Award": {
		id: 5
	}
}

export const STATUS_ACTIVE = 'Active';
export const STATUS_ARCHIVED = 'Archived';

export const COMPLIANCE_YEAR_START = 1975;

export const DEFAULT_INITIATOR = 'BC Government';

export const ADD_COMMAS_REGEX = /\B(?=(\d{3})+(?!\d))/g;