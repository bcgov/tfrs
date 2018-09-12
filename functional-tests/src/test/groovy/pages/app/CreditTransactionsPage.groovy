package pages

class CreditTransactionsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == "Credit Transactions" }
  static url = "/credit_transactions"
  static content = {
    pageTitle { $("#main .page_credit_transactions h1") }

    newTransferButton { $("#credit-transfer-new-transfer") }
  }

  /**
   * Parse the credit balance string into an integer containing only the number of credits.
   * @return credit balance value
   * @throws NumberFormatException if the parsed credit balance string fails to be casted to an Integer.
   */
  Integer getCreditBalance() {
    return creditBalance.text().replace(/[^0-9]/, "") as Integer
  }
}
