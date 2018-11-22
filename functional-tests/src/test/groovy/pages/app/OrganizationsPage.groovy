package pages

class OrganizationsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Fuel Suppliers' }
  static url = '/organizations'
  static content = {
    pageTitle { $('#main .page_organizations h1') }

    companiesTable(wait:true) { $('.ReactTable') }
  }

  void setCompanyNameFilter(String companyName) {
    // Get the filters header row, and get the input field of its first child (first column).
    companiesTable.$('.-filters').$('.rt-th')[0].$('input').value(companyName)
  }

  void selectCompanyByText(String companyName) {
    setCompanyNameFilter(companyName)
    companiesTable.$('.rt-tbody').$('a', text:companyName).click()
  }
}
