package modules

import geb.Module

/**
 * Contains objects and methods for interacting with the global header bar.
 */
class HeaderModule extends Module {
  static content = {
    bcLogo { $('#logo') }

    usernameButton { $('#display-name-button') }
    userOrganization { $('#user_organization') }

    notificationButton { $('#navbar-notifications') }
    notificationCountIcon { $('#navbar-notifications').$('span.fa-layers-counter') }

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
   * Parse the notification count string into an integer.
   * @return notification count
   * @throws NumberFormatException if the parsed notification count string fails to be casted to an Integer.
   */
  Integer getNotificationCount() {
    notificationCountIcon.text().replace(/[^0-9]/, '') as Integer
  }
}
