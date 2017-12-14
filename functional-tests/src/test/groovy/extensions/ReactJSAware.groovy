package extensions

trait ReactJSAware {
 
    boolean isReactReady() {
        waitFor {
            js.exec('return document.readyState;') == "complete"
        }

    }
}

