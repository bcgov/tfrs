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
  void login(Map user) {
    to LoginPage

    usernameField.value(user.username)
    passwordField.value(user.password)

    logInButton.click()

    at HomePage
  }

  void logInAsSendingFuelSupplier() {
    login(getSendingFuelSupplier())
  }

  void logInAsReceivingFuelSupplier() {
    login(getReceivingFuelSupplier())
  }

  void logInAsAnalyst() {
    login(getAnalyst())
  }

  void logInAsDirector() {
    login(getDirector())
  }
}
