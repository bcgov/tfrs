package specs

import geb.spock.GebReportingSpec

import traits.Login
import traits.Utils

/**
 * Base spec for tests that require being logged in.
 */
abstract class LoggedInSpec extends GebReportingSpec implements Login, Utils {
  /**
   * Cleanup that runs after each test.
   *
   * Clears and restarts the browser, the next test will open in a new browser.
   */
  void cleanup() {
    clearAndResetBrowser()
  }
}
