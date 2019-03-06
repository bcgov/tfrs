package pages

class AddAdminUserPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'New User' }
  static url = '/admin/users/add'
  static content = {
    pageTitle { $('#main .page_admin_user h1') }

    firstNameField { $('#first-name') }
    lastNameField { $('#last-name') }
    bceidEmailField { $('#keycloak-email') }
    workPhoneField { $('#work-phone') }
    mobilePooneField { $('#mobile-phone') }
    emailField { $('#email') }
    statusDropdown { $('#status') }

    rolesSection { $('#user-roles') }

    saveUserButton { $('#save-user')}
  }

  void setFirstName(String firstName) {
    firstNameField.value(firstName)
  }

  void setLastName(String lastName) {
    lastNameField.value(lastName)
  }

  /**
   * Note: this field must be unique.
   */
  void setBCeIDEmail(String bceidEmail) {
    bceidEmailField.value(bceidEmail)
  }

  void setWorkPhone(String workPhone) {
    workPhoneField.value(workPhone)
  }

  void setMobilePhone(String mobilePhone) {
    mobilePooneField.value(mobilePhone)
  }

  void setEmail(String email) {
    emailField.value(email)
  }

  void setStatus(String status) {
    statusDropdown.$('option', text:status).click()
  }

  void checkUserRoleCheckboxByText(String roleText) {
    rolesSection.$('span', text:roleText).siblings('svg').click()
  }

  void clickSaveUserButton() {
    saveUserButton.click()
  }
}
