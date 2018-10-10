package pages

/**
 * Generic page that represents a toast modal.
 *
 * Example:
 *   at new ToastModal('Success!', 'Credit Transfer Proposal sent.')
 */
class ToastModal extends BaseAppPage {
  static at = { verifyToastContent() }
  static content = {
    // TODO is it possible to add an ID to this third-party component? is it even necessary?
    modalSelector(wait:true) { $('.toastr') }

    pageTitle { modalSelector.$('.rrt-title') }
    pageBody { modalSelector.$('.rrt-text') }
  }

  private final String expectedTitle
  private final String expectedMessage

  /**
   * Constructor.
   *
   * @param String expectedTitle the expected message title.
   * @param String expectedMessage the expected message body.
   */
  ToastModal(String expectedTitle, String expectedMessage) {
    this.expectedTitle = expectedTitle
    this.expectedMessage = expectedMessage
  }

  /**
   * Verify if the expected modal is displayed on the page.
   *
   * @return true if the modal is being displayed and the modal title and body strings match the expected strings.
   */
  Boolean verifyToastContent() {
    modalModule.isOpen(modalSelector) && pageTitle.text() == expectedTitle && pageBody.text() == expectedMessage
  }
}
