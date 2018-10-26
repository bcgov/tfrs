package traits

import geb.driver.CachingDriverFactory

/**
 * Generic re-usable utility methods.
 */
trait Utils {
  /**
   * Clears the browser and closes it.
   * The next spec to run will open a fresh browser instance.
   */
  void clearAndResetBrowser() {
    resetBrowser()
    CachingDriverFactory.clearCacheAndQuitDriver()
  }

  /**
   * Throw an AssertionError with the given message.
   *
   * @param String the exception message to throw. (optional, default: '')
   * @throws AssertionError
   */
  void fail(String message='') {
    throw new AssertionError(message)
  }
}
