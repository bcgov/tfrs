package pages

class CreditTransactionsConfirmApproveModal extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Confirmation' }
  static content = {
    modalSelector(wait:true) { $('#confirmApprove') }

    pageTitle { modalSelector.$('.modal-header h4') }

    yesButton { modalSelector.$('#modal-yes') }
  }

  /**
   * Waits for the modal window to open.
   * Clicks the 'Yes' button.
   *
   * @param checkClosed enable or disable checking if the modal closed.  This is often necessary if the modal closes
   *  slowly, and the test needs to wait for it to fully close before continuing.  If the modal triggers a change of
   *  page, this check should NOT be enabled as the modal reference is now stale, and cannot be accessed.
   *  (Optional, default: false)
   */
  void approveCreditTransaction(Boolean checkClosed=false) {
    modalModule.isOpen(modalSelector)
    yesButton.click()
    if (checkClosed) {
      modalModule.isClosed()
    }
  }
}
