package specs

import specs.traits.Login

/**
 * Base spec for tests that require being logged in.
 */
abstract class LoggedInSpec extends BaseSpec implements Login {
  /**
   * Cleanup that runs after each test.
   *
   * Clears and restarts the browser, the next test will open in a new browser.
   */
  void cleanup() {
    clearAndResetBrowser()
  }
}
