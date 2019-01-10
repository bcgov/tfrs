export default class CreditTransactionRequestUtilityFunctions {
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
