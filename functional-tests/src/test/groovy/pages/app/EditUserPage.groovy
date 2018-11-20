package pages

class EditUserPage extends BaseAppPage {
  static at = {
    isReactReady() &&
    // Match urls for regular and admin users. This is only acceptable if we never want to call 'to EditUserPage'
    // in which case we would need to have a specific static url set to a single concrete url.
    browser.getCurrentUrl() =~ /(admin)?\/users\/edit\/[0-9]+$/
  }
  static content = {
    pageTitle { $('#main .page_admin_user h1') }

    // These field selectors appear to load with the page, but this wait is apparently still necessary as
    // the test initially receives an empty selector and fails.  Note: Waiting for the first item in this list gives
    // the other fields time to render fully.  If firstNameField is moved lower, the wait will need to be re-added to
    // the new first item in the list (or to all items in general).
    firstNameField(wait:true) { $('#first-name') }
    lastNameField { $('#last-name') }
    bceidEmailField { $('#bceid') }
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
