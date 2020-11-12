package pages

import geb.Page

class LoginPage extends Page {

  static url = "https://dev.oidc.gov.bc.ca/auth/auth/realms/tfrs-dev/protocol/openid-connect/auth?response_type=token&client_id=tfrs-dev&redirect_uri=https://dev-lowcarbonfuels.pathfinder.gov.bc.ca"

  static at = {
    // Regex being used to temporarily cover the differences between dev and keycloak login pages
    title.trim() =~ 'Log in to (TFRS|Transportation Fuels Reporting System)' &&
    pageTitle.text().trim() =~ '(TFRS|TRANSPORTATION FUELS REPORTING SYSTEM|Transportation Fuels Reporting System)'
  }
  static content = {
    pageTitle { $('#kc-header-wrapper') }

    usernameField { $('#username') }
    passwordField { $('#password') }
    logInButton { $('#kc-login') }
  }
}
