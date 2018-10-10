package pages

/**
 * Represents the Credit Transactions page when logged in as an analyst
 */
class NewCreditTransactionPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'New Credit Transaction' }
  static url = '/credit_transactions/add'
  static content = {
    pageTitle { $('#main .credit-transaction h1') }

    transactionTypeButtons { $('#transaction-type') }
    respondentField { $('#respondent') }
    numberOfCreditsField { $('#number-of-credits') }
    compliancePeriodDropdown { $('#compliance-period') }

    addCommentButton { $('#credit-transfer-add-comment') }
    addInternalCommentButton { $('#credit-transfer-add-internal-comment') }
    commentField { $('#credit-transfer-comment') }

    recommendButton { $('button', type:'button', text:'Recommend for Approval') } //TODO add ID?
  }

  void setTransactionType(String type) {
    transactionTypeButtons.$('button', text:type).click()
  }

  void setNumberOfCredits(int credits) {
    numberOfCreditsField.value(credits)
  }

  void setRespondent(String respondent) {
    respondentField.$('option', text:respondent).click()
  }

  void setCompliancePeriod(String period) {
    compliancePeriodDropdown.$('option', text:period).click()
  }

  void addComment(String comment) {
    waitFor {
      addCommentButton.click()
      commentField.value(comment)
    }
  }

  void addInternalComment(String comment) {
    waitFor {
      addInternalCommentButton.click()
      commentField.value(comment)
    }
  }

  void recommendCreditTransaction() {
    waitFor { recommendButton.click() }
  }
}
