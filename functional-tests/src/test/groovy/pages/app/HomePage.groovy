package pages

import geb.waiting.WaitTimeoutException

/**
 * The initial landing page the user is redirected to after logging in.
 */
class HomePage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.first().text() == 'Credit Market Report' }
  static url = '/'
  static content = {
    pageTitle { $('#main .col-md-3 a') }
  }

}
