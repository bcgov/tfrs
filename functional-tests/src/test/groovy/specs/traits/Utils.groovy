package specs.traits

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

  /**
   * Appends a random 2-3 digit integer to the beginning of the provided string.
   * @param nonUniqueString a string to make unique.
   * @return the given string with random digits appended to the beginning.
   */
  String makeUnique(String nonUniqueString) {
    String random = Math.abs(new Random().nextInt() % 600) + 1
    return random + nonUniqueString
  }
}
