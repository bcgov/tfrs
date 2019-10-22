package pages

/**
 * The initial landing page the user is redirected to after logging in.
 */
class HomePage2 extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'tfrs' }
  static url = '/'
  static content = {

  }

}
