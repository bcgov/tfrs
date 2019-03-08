package pages

class AddUserPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'New User' }
  static url = '/users/add'
  static content = {
    pageTitle { $('#main .page_admin_user h1') }

    firstNameField { $('#first-name') }
    lastNameField { $('#last-name') }
    bceidEmailField { $('#keycloak-email') }
    workPhoneField { $('#work-phone') }
    mobilePooneField { $('#mobile-phone') }
    emailField { $('#email') }
    organizationField(required:false) { $('#organization') }
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

  // Note: This function is not always callable as the organization field, depending on the workflow, may be pre-set
  // and therefore can not be set or changed.
  void setOrganization(String organization) {
    // Enter the name of the organization in the search
    organization = organization.replace("\"", "")
    organizationField.$('input').value(organization)
    interact {
      waitFor {
        // Wait for the dropdown to populate and click the element in the list with the matching text
        moveToElement(organizationField.$('.dropdown-menu').$('li', text:~"$organization")).click()
      }
    }
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
