package pages

class OrganizationViewPage extends BaseAppPage {
  static at = {
    isReactReady() &&
    browser.getCurrentUrl() =~ /organizations\/view\/[0-9]+$/ &&
    pageTitle.text() == expectedPageTitle
  }
  static content = {
    pageTitle { $('#main .page_organization h1') }

    editButton { $('#edit-organization')}

    newUserButton { $('#new-user') }

    usersTable(wait:true) { $('.ReactTable') }
  }

  private final String expectedPageTitle

  /**
   * Constructor.
   *
   * @param String expectedPageTitle the expected page title.
   */
  OrganizationViewPage(String expectedPageTitle) {
    this.expectedPageTitle = expectedPageTitle.replace("\"", "")
  }

  void clickEditButton() {
    editButton.click()
  }

  void clickNewUserButton() {
    newUserButton.click()
  }

  void setUserNameFilter(String usersName) {
    // Get the filters header row, and get the input field of its first child (first column).
    usersTable.$('.-filters').$('.rt-th')[0].$('input').value(usersName)
  }

  void clickUserRow(String usersName) {
    setUserNameFilter(usersName)
    usersTable.$('.rt-tbody').$('.clickable').has('.col-name', text:usersName).click()
  }
}
