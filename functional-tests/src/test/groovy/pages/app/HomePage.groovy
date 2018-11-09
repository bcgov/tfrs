package pages

import geb.waiting.WaitTimeoutException

/**
 * The initial landing page the user is redirected to after logging in.
 */
class HomePage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Credit Transactions' }
  static url = '/'
  static content = {
    pageTitle { $('#main .page_credit_transactions h1') }

    creditBalanceString { $('#main .credit_balance h3') }
  }

  /**
   * Parse the credit balance string into an Integer containing only the number of credits.
   *
   * @return credit balance value
   * @throws NumberFormatException if the parsed credit balance string fails to be cast to an Integer.
   */
  Integer getCreditBalance() {
    creditBalanceString.text().replaceAll(/[^0-9]/, '').toInteger()
  }
}
