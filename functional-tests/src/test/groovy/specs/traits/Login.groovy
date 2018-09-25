package traits

import pages.LoginPage
import pages.HomePage

/**
 * Methods to manage logging in.
 */
trait Login implements Users {

  /**
   * Log a user in.
   *
   * @param username the login username
   * @param password the login password
   */
  void login(String username, String password) {
    to LoginPage

    usernameField.value(username)
    passwordField.value(password)

    continueButton.click()

    at HomePage
  }

  void logInAsSendingFuelSupplier() {
    if (getBaseUrl() =~ 'localhost') {
      setBaseUrl('http://localhost:5001/')
      to HomePage
    } else {
      login(getSendingFuelSupplier())
    }
  }

  void logInAsReceivingFuelSupplier() {
    if (getBaseUrl() =~ 'localhost') {
      setBaseUrl('http://localhost:5002/')
      to HomePage
    } else {
      login(getReceivingFuelSupplier())
    }
  }

  void logInAsAnalyst() {
    if (getBaseUrl() =~ 'localhost') {
      setBaseUrl('http://localhost:5004/')
      to HomePage
    } else {
      login(getAnalyst())
    }
  }

  void logInAsDirector() {
    if (getBaseUrl() =~ 'localhost') {
      setBaseUrl('http://localhost:5005/')
      to HomePage
    } else {
      login(getDirector())
    }
  }
}
