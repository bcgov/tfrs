package pages

class NotificationsPage extends BaseAppPage {
  static at = { isReactReady()  && pageTitle.text() == "Notifications" }
  static url = "/notifications"
  static content = {
    pageTitle { $("#main .page_notifications h1") }

    notificationTable { $(".ReactTable") }
  }

  /**
   * Return the row credit transfer anchor tag based on link text.
   * @param linkText link text to match on
   * @return a non-empty geb navigator if element found, an empty geb navigator otherwise.
   */
  def getCreditTransferLinkByText(String linkText) {
    def linkSelector = notificationTable.$(".rt-tbody div").$("a", text: "$linkText")

    // covers an odd issue where a selector that should return 1 record instead returns 3
    if (linkSelector.size() > 1) {
      return linkSelector[0]
    }
    return linkSelector
  }
}
