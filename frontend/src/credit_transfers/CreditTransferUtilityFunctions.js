import COMMENTS from '../constants/permissions/Comments';
import {CREDIT_TRANSFER_STATUS} from '../constants/values';

export default class CreditTransferUtilityFunctions {
  static canComment (loggedInUser, item) {
    if (!item.status) {
      return false;
    }

    switch (item.status.id) {
      // right now, only government users can comment. this can easily be changed, though.

      case CREDIT_TRANSFER_STATUS.accepted.id:
      case CREDIT_TRANSFER_STATUS.notRecommended.id:
      case CREDIT_TRANSFER_STATUS.recommendedForDecision.id:
        return true;
      default:
        return false;
    }
  }

  static willCreatePrivilegedComment (loggedInUser, item) {
    if (!item.status) {
      return false;
    }
    // the item is available here too, if the decision is more complex
    return !!loggedInUser.hasPermission(COMMENTS.EDIT_PRIVILEGED);
  }
}
