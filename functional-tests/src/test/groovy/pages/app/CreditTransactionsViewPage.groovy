package pages

class CreditTransactionsViewPage extends BaseAppPage {
  static at = {
    isReactReady() &&
    browser.getCurrentUrl() =~ /credit_transactions\/view\/[0-9]+$/ &&
    pageTitle.text() == expectedPageTitle
  }
  static content = {
    pageTitle { $('#main .credit-transfer h1') }

    termsCheckboxes(required:false) { $('#credit-transfer-term') }

    addCommentButton { $('#credit-transfer-add-comment') }
    addInternalCommentButton(required:false) { $('#credit-transfer-add-internal-comment') }
    saveCommentButton(required:false) { $('#credit-transfer-save-comment') }
    commentField(required:false) { $('#credit-transfer-comment') }

    signButton(required:false) { $('#credit-transfer-accept') }
    recommendButton(required:false) { $('#credit-transfer-recommend') }
    approveButton(required:false) { $('#credit-transfer-approve') }
  }

  private final String expectedPageTitle

  /**
   * Constructor.
   *
   * @param String expectedPageTitle the expected page title.
   */
  CreditTransactionsViewPage(String expectedPageTitle) {
    this.expectedPageTitle = expectedPageTitle
  }

  void checkTerms() {
    waitFor {
      termsCheckboxes
    }.each { element ->
      element.click()
    }
  }

  void addComment(String comment) {
    waitFor {
      addCommentButton.click()
      commentField.value(comment)
      saveCommentButton.click()
    }
  }

  void addInternalComment(String comment) {
    waitFor {
      addInternalCommentButton.click()
      commentField.value(comment)
      saveCommentButton.click()
    }
  }

  void signCreditTransfer() {
    waitFor { signButton.click() }
  }

  void recommendCreditTransfer() {
    waitFor { recommendButton.click() }
  }

  void approveCreditTransfer() {
    waitFor { approveButton.click() }
  }
}
