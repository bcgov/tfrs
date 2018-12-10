package pages

class CreditTransactionsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Credit Transactions' }
  static url = '/credit_transactions'
  static content = {
    pageTitle { $('#main .page_credit_transactions h1') }

    newTransferButton { $('#credit-transfer-new-transfer') }

    downloadButton { $('#download-credit-transfers') }
  }

  String getDownloadButtonText() {
    downloadButton.text().replaceAll(/[^a-zA-Z.]\s/, '')
  }

  void clickDownloadButton() {
    waitFor { downloadButton.click() }
  }
}
