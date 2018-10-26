package pages

/**
 * Represents the Credit Transactions page when logged in as a fuel supplier
 */
class NewCreditTransferPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'New Credit Transfer' }
  static url = '/credit_transactions/add'
  static content = {
    pageTitle { $('#main .credit-transfer h1') }

    transactionTypeDropdown { $('#proposal-type') }
    numberOfCreditsField { $('#number-of-credits') }
    respondentField { $('#respondent') }
    pricePerCreditField { $('#value-per-credit') }
    commentField { $('#credit-transfer-comment') }

    termsCheckboxes { $('#credit-transfer-term') }
    signButton { $('#credit-transfer-sign') }
  }

  void setTransactionType(String type) {
    transactionTypeDropdown.$('option', text:type).click()
  }

  void setNumberOfCredits(int credits) {
    numberOfCreditsField.value(credits)
  }

  void setRespondent(String respondent) {
    respondentField.$('option', text:respondent).click()
  }

  void setPricePerCredit(int price) {
    pricePerCreditField.value(price)
  }

  void checkTerms() {
    termsCheckboxes.each { element ->
      element.click()
    }
  }

  void addComment(String comment) {
    commentField.value(comment)
  }

  void signCreditTransfer() {
    signButton.click()
  }
}
