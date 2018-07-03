import COMMENTS from '../constants/permissions/Comments';

export default class CreditTransferUtilityFunctions {
  static canComment (loggedInUser, item) {
    if (!item.commentActions) {
      return false;
    }

    return item.commentActions.includes('ADD_COMMENT');
  }

  static canCreatePrivilegedComment (loggedInUser, item) {
    if (!item.commentActions) {
      return false;
    }

    return item.commentActions.includes('ADD_PRIVILEGED_COMMENT');
  }
}
