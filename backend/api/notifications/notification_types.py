from enum import Enum


class NotificationType(Enum):
    CREDIT_TRANSFER_CREATED = "Credit Transfer Proposal Created"
    CREDIT_TRANSFER_SIGNED_1OF2 = "Credit Transfer Proposal Signed 1/2"
    CREDIT_TRANSFER_SIGNED_2OF2 = "Credit Transfer Proposal Signed 2/2"
    CREDIT_TRANSFER_PROPOSAL_REFUSED = "Credit Transfer Proposal Refused"
    CREDIT_TRANSFER_PROPOSAL_ACCEPTED = "Credit Transfer Proposal Accepted"
    CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL = "Credit Transfer Proposal Recommended For Approval"
    CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION = "Credit Transfer Proposal Recommended For Declination"
    CREDIT_TRANSFER_DECLINED = "Credit Transfer Proposal Declined"
    CREDIT_TRANSFER_APPROVED = "Credit Transfer Proposal Approved"
    CREDIT_TRANSFER_RESCINDED = "Credit Transfer Proposal Rescinded"
    CREDIT_TRANSFER_COMMENT = "Credit Transfer Proposal Comment Created Or Updated"
    CREDIT_TRANSFER_INTERNAL_COMMENT = "Credit Transfer Proposal Internal Comment Created Or Updated"

    PVR_CREATED = "PVR Created"
    PVR_RECOMMENDED_FOR_APPROVAL = "PVR Recommended For Approval"
    PVR_PULLED_BACK = "PVR Pulled Back"
    PVR_DECLINED = "PVR Declined"
    PVR_APPROVED = "PVR Approved"
    PVR_COMMENT = "PVR Comment Created Or Updated"
    PVR_INTERNAL_COMMENT = "PVR Internal Comment Created Or Updated"
