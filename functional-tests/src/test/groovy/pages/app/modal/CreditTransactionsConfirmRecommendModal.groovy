package pages

class CreditTransactionsConfirmRecommendModal extends BaseAppPage {
  static at = { pageTitle.text() == "Confirmation" }
  static content = {
    modalSelector { $("#confirmRecommend") }

    pageTitle { modalSelector.$(".modal-header h4") }

    yesButton { modalSelector.$("#modal-yes") }
  }

  /**
   * Waits for the modal window to open.
   * Clicks the 'Yes' button.
   * Waits for the modal window to close.
   */
  def recommendCreditTransaction() {
    modalModule.isOpen(modalSelector)
    yesButton.click()
    modalModule.isClosed()
  }
}