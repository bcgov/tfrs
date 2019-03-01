export default class SecureFileSubmissionUtilityFunctions {

  static canLinkCreditTransfer (loggedInUser, item) {
    if (!item.linkActions) {
      return false;
    }

    return item.linkActions.includes('ADD_LINK');
  }


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
