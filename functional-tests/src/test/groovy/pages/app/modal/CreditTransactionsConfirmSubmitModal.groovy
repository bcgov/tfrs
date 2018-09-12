package pages

class CreditTransactionsConfirmSubmitModal extends BaseAppPage {
  static at = { pageTitle.text() == "Confirmation" }
  static content = {
    modalSelector { $("#confirmSubmit") }

    pageTitle { modalSelector.$(".modal-header h4") }

    yesButton { modalSelector.$("#modal-yes") }
  }

  /**
   * Waits for the modal window to open.
   * Clicks the 'Yes' button.
   * Waits for the modal window to close.
   */
  def confirmCreditTransaction() {
    modalModule.isOpen(modalSelector)
    yesButton.click()
    modalModule.isClosed()
  }
}