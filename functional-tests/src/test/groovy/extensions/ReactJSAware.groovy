package extensions

/**
 * Wait for the document to finish loading
 * @return true if document has finished loading, false otherwise.
 */
trait ReactJSAware {
  boolean isReactReady() {
    waitFor {
      js.exec('return document.readyState;') == 'complete'
    }
  }
}
