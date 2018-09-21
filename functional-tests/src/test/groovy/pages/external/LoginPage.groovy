package pages

import geb.Page

class LoginPage extends Page {
  static at = {
    title == 'Government of British Columbia' &&
    browser.getCurrentUrl() =~ 'logontest\\.gov\\.bc\\.ca' &&
    pageTitle.text() == 'Log in to dev.lowcarbonfuels.gov.bc.ca'
  }
  static url = '/' // when not logged in will be redirected to the external gov login page
  static content = {
    pageTitle { $('#login-to') }

    usernameField { $('#user') }
    passwordField { $('#password') }
    continueButton { $('input', type:'submit', value:'Continue') }
  }
}
