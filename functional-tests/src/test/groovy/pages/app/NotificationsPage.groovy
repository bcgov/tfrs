package pages

import geb.navigator.Navigator

class NotificationsPage extends BaseAppPage {
  static at = { isReactReady()  && pageTitle.text() == 'Notifications' }
  static url = '/notifications'
  static content = {
    pageTitle { $('#main .page_notifications h1') }

    notificationTable { $('.ReactTable') }
  }

  /**
   * Return the row credit transfer button link that matches the provided linkText and which has highest transaction ID.
   *
   * @param linkText the notification link text to match on
   * @return a non-empty geb navigator if element found, null otherwise.
   */
  Navigator getCreditTransferLinkByText(String linkText) {
    def sortedUnreadMatchingRows = getSortedMatchingRows(linkText)
    def highestIDUnreadMatchingRow = sortedUnreadMatchingRows[0]
    return highestIDUnreadMatchingRow?.$('.col-notification')?.$('button')
  }

  /**
   * Filters unread notifications table rows by the provided linkText, and sorts them in descending order based on the
   * transaction ID column.
   *
   * @param linkText the notification link text to match on.
   * @return list of filtered, sorted table rows.
   */
  List<Navigator> getSortedMatchingRows(String linkText) {
    waitFor {
      def tableRowsParent = notificationTable.$('.rt-tbody')
      def unreadMatchingRows = tableRowsParent.children().has('.unread').has('.col-notification button', text: linkText)
      def sortedUnreadMatchingRows = unreadMatchingRows.sort{ a, b ->
        b.$('.col-credit-trade button').text().toInteger() <=> a.$('.col-credit-trade button').text().toInteger()
      }
      return sortedUnreadMatchingRows
    }
  }
}
