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

    headerNavigationBar { $('#header #header-main .navigationRibbon .level2Navigation .container-fluid') }
  }

  /**
   * Clicks header menu anchor tags based on the displayed text.
   *
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
   *   you may get false-positives.  To improve performance, the wait time should be as little as safely possible.
   *
   * @param int wait how long to wait for the async notification request to finish, and the icon to render, before
   *   assuming it is not going to (if there are no notifications). (optional, default: 3)
   * @return notification count integer
   * @throws NumberFormatException if the parsed notification count string fails to be cast to an Integer.
   */
  Integer getNotificationCount(int wait=3) {
    Integer count = 0

    try {
      // We cant use 'waitFor(3)' in this case because the notification icon may exist, but it may not have been
      // updated yet by the async notification request which has not yet finished.  So we need to manually enforce a
      // wait using 'sleep(3000)'
      sleep(wait * 1000)
      count = waitFor(0) { // convenient way to cause a predictable exception if this selector never exists.
        notificationButton.$('span.fa-layers-counter')
      }.text().replace(/[^0-9]/, '').toInteger()
    } catch(WaitTimeoutException e) {
      // ignore because the notification count icon doesn't necessarily always exist (if there are no notifications)
    }

    return count
  }
}
