package pages

class OrganizationsViewPage extends BaseAppPage {
  static at = {
    isReactReady() &&
    browser.getCurrentUrl() =~ /organizations\/view\/[0-9]+$/ &&
    pageTitle.text() == expectedPageTitle
  }
  static content = {
    pageTitle { $('#main .page_organization h1') }

    newUserButton { $('#new-user') }

    usersTable(wait:true) { $('.ReactTable') }
  }

  private final String expectedPageTitle

  /**
   * Constructor.
   *
   * @param String expectedPageTitle the expected page title.
   */
  OrganizationsViewPage(String expectedPageTitle) {
    this.expectedPageTitle = expectedPageTitle
  }

  void clickNewUserButton() {
    newUserButton.click()
  }

  void clickUserRow(String usersName) {
    usersTable.$('.rt-tbody').$('.clickable').has('.col-name', text:usersName).click()
  }
}
