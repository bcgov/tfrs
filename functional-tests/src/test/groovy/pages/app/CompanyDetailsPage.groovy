package pages

class CompanyDetailsPage extends BaseAppPage {
  // page title text is dynamic, but should match the user organization
  static at = { isReactReady() && pageTitle.text() == headerModule.userOrganization.text() }
  static url = '/organizations/mine'
  static content = {
    pageTitle { $('#main .page_organization h1') }

    newUserButton { $('#new-user') }

    usersTable(wait:2) { $('.ReactTable') }
  }

  void clickNewUserButton() {
    newUserButton.click()
  }

  void clickUserRow(String usersName) {
    usersTable.$('.rt-tbody').$('.clickable').has('.col-name', text:usersName).click()
  }
}
