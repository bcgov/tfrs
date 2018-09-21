package specs

import geb.spock.GebReportingSpec

import traits.Login
import traits.Utils

import pages.HomePage

/**
 * Extend this class in test suites where being logged in is a pre-requisite.
 *  - Before each test: traverse to the login page, log in, assert at the home page.
 *  - After each test: clear and restart the browser in preparation for the next test.
 */
abstract class LoggedInSpec extends GebReportingSpec implements Login, Utils {
  /**
   * Return the username to log in with.
   */
  abstract String getUsername()

  /**
   * Return the password to log in with.
   */
  abstract String getPassword()

  /**
   * Setup that runs before each test.
   *
   * Logs the specified user in.
   */
  void setup() {
    login(getUsername(), getPassword())
  }

  /**
   * Cleanup that runs after each test.
   *
   * Clears and restarts the browser, the next test will open in a new browser.
   */
  void cleanup() {
    clearAndResetBrowser()
  }
}
