package pages.traits

/**
 * Generic re-usable utility methods.
 */
trait Utils {
  /**
   * Wait for the document to finish loading
   * @return true if document has finished loading, false otherwise.
   */
  Boolean isReactReady() {
    waitFor {
      js.exec('return document.readyState;') == 'complete'
    }
  }
}
