package pages

import geb.Page

class LoginPage extends Page {
  static at = {
    // Regex being used to temporarily cover the differences between dev and keycloak login pages
    title.trim() =~ 'Log in to (TFRS|Transportation Fuels Reporting System)' &&
    pageTitle.text().trim() =~ '(TFRS|TRANSPORTATION FUELS REPORTING SYSTEM)'
  }
  static content = {
    pageTitle { $('#kc-header-wrapper') }

    usernameField { $('#username') }
    passwordField { $('#password') }
    logInButton { $('#kc-login') }
  }
}
