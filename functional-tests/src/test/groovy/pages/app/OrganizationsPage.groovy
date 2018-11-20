package pages

class OrganizationsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Fuel Suppliers' }
  static url = '/organizations'
  static content = {
    pageTitle { $('#main .page_organizations h1') }

    companiesTable(wait:2) { $('.ReactTable') }
  }

  void selectCompanyByText(String linkText) {
    companiesTable.$('.rt-tbody').$('a', text:linkText).click()
  }
}
