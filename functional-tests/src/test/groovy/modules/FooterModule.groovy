package modules

import geb.Module

/**
 * Contains objects and methods for interacting with the global footer bar.
 */
class FooterModule extends Module {
  static content = {
    footerBar { $("#footer #footerAdminLinks") }
  }

  /**
   * Clicks footer menu anchor tags based on the displayed text.
   * @param [text:'footer link text'] the displayed text of the footer menu anchor tag.
   */
  void clickMenuItem(Map<String, Object> itemSelector) {
    footerBar.$(itemSelector, "a").click()
  }
}
