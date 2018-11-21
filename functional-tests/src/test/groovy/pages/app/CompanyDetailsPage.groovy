package pages

class CompanyDetailsPage extends BaseAppPage {
  // page title text is dynamic, but should match the user organization
  static at = { isReactReady() && pageTitle.text() == headerModule.userOrganization.text() }
  static url = '/organizations/mine'
  static content = {
    pageTitle { $('#main .page_organization h1') }

    newUserButton { $('#new-user') }

    usersTable(wait:true) { $('.ReactTable') }
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
