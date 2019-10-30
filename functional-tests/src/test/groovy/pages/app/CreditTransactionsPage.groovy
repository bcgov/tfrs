package pages

class CreditTransactionsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Credit Transactions' }
  static url = '/credit_transactions'
  static content = {
    pageTitle { $('#main .page_credit_transactions h1') }

    newTransferButton { $('#credit-transfer-new-transfer') }

    downloadButton { $('#download-credit-transfers') }

    creditBalanceString { $('#main .credit_balance h3') }
  }

  String getDownloadButtonText() {
    downloadButton.text().replaceAll(/[^a-zA-Z.]\s/, '')
  }

  void clickDownloadButton() {
    waitFor { downloadButton.click() }
  }

  /**
   * Parse the credit balance string into an Integer containing only the number of credits.
   *
   * @return credit balance value
   * @throws NumberFormatException if the parsed credit balance string fails to be cast to an Integer.
   */
  Integer getCreditBalance() {
    creditBalanceString.text().replaceAll(/[^0-9]/, '').toInteger()
  }
}
