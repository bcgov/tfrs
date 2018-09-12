package traits

import traits.Users

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
  def login(String username, String password) {
    to LoginPage

    usernameField.value(username)
    passwordField.value(password)

    continueButton.click()

    at HomePage
  }

  def logInAsSendingFuelSupplier() {
    if (getBaseUrl() =~ "localhost") {
      setBaseUrl("http://localhost:5001/")
      go()
    } else {
      login(getSendingFuelSupplier())
    }
  }

  def logInAsReceivingFuelSupplier() {
    if (getBaseUrl() =~ "localhost") {
      setBaseUrl("http://localhost:5002/")
      go()
    } else {
      login(getReceivingFuelSupplier())
    }
  }

  def logInAsAnalyst() {
    if (getBaseUrl() =~ "localhost") {
      setBaseUrl("http://localhost:5004/")
      go()
    } else {
      login(getAnalyst())
    }
  }

  def logInAsDirector() {
    if (getBaseUrl() =~ "localhost") {
      setBaseUrl("http://localhost:5005/")
      go()
    } else {
      login(getDirector())
    }
  }
}
