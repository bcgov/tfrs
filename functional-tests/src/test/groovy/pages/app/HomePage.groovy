package pages

/**
 * The initial landing page the user is redirected to after logging in.
 */
class HomePage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == "Credit Transactions" }
  static url = "/"
  static content = {
    pageTitle { $("#main .page_credit_transactions h1") }
  }
}
