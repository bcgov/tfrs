package modules

import geb.Module

import geb.waiting.WaitTimeoutException

/**
 * Contains objects and methods for interacting with the global header bar.
 */
class HeaderModule extends Module {
  static content = {
    bcLogo { $('#logo') }

    usernameButton { $('#display-name-button') }
    userOrganization { $('#user_organization') }

    // 2 instances of #navbar-notifications are present on the page (the other for mobile view), adding .fa-layers
    // enables us to distinguish between them as only the browser version has sub elements.
    notificationButton { $('#navbar-notifications .fa-layers') }

    headerNavigationBar { $('#header #header-main .navigationRibbon .level2Navigation .container') }
  }

  /**
   * Clicks header menu anchor tags based on the displayed text.
   * @param [text:'header link text'] the displayed text of the header menu anchor tag.
   */
  void clickMenuItem(Map<String, Object> itemSelector) {
    headerNavigationBar.$(itemSelector, 'a').click()
  }

  /**
   * Parse the notification count string into an integer if it exists, otherwise return 0.
   *
   * Note: When no notifications exist, the notification count selector will not exist.  As a result of this and
   *   the asynchronous notifications request which the existence of notification count depends upon, it is necessary
   *   to wait for some period of time before assuming the notification count is intentionally absent.  Otherwise
   *   you may get false-positives.  To prove performance, the wait time should be as little as safely possible.
   *
   * @param int wait how long to wait for the notification count icon to load, before assuming it is not going to.
   *   (optional, default: 2)
   * @return notification count integer
   * @throws NumberFormatException if the parsed notification count string fails to be casted to an Integer.
   */
  Integer getNotificationCount(int wait=2) {
    Integer count = 0

    try {
      count = waitFor(wait) {
        notificationButton.$('span.fa-layers-counter')
      }.text().replace(/[^0-9]/, '').toInteger()
    } catch(WaitTimeoutException e) {
      // ignore because the notification count icon doesn't necessarily always exist
    }

    return count
  }

  /**
   * Compare the current notification icon count against the provided expected count.
   *
   * Note: When no notifications exist, the notification count selector will not exist.  As a result of this and
   *   the asynchronous notifications request which the existence of notification count depends upon, it is necessary
   *   to wait for some period of time before assuming the notification count is intentionally absent.  Otherwise
   *   you may get false-positives.  To prove performance, the wait time should be as little as safely possible.
   *
   * @param expectedCount the expected notification count to assert against.
   * @param int wait how long to wait for the notification counts to match. (optional, default: 2)
   * @return true if the notification counts match.
   * @throws AssertionError if the notification counts fail to match after retrying for the specified time.
   */
  Boolean compareNotificationCounts(int expectedCount, int wait=2) {
    try {
      waitFor(wait) {
        getNotificationCount() == expectedCount
      }
    } catch (WaitTimeoutException e) {
      fail('The current notification count did not match the expected count.')
    }

    return true
  }
}
