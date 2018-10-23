package pages

import geb.Page

class LoginPage extends Page {
  static at = {
    title.trim() == 'Log in to Transportation Fuels Reporting System' &&
    pageTitle.text().trim() == 'TRANSPORTATION FUELS REPORTING SYSTEM'
  }
  static content = {
    pageTitle { $('#kc-header-wrapper') }

    usernameField { $('#username') }
    passwordField { $('#password') }
    logInButton { $('input', type:'submit', value:'Log in') }
  }
}
