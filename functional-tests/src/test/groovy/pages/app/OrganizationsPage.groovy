package pages

class OrganizationsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Fuel Suppliers' }
  static url = '/organizations'
  static content = {
    pageTitle { $('#main .page_organizations h1') }

    createOrganizationButton { $('#create-organization')}

    companiesTable(wait:true) { $('.ReactTable') }
  }

  void clickCreateOrganizationButton() {
    createOrganizationButton.click()
  }

  void setCompanyNameFilter(String companyName) {
    // Get the filters header row
    def filtersRow = companiesTable.$('.-filters')
    // Get the first column of the filters header row
    def firstFiltersRowColumn = filtersRow.$('.rt-th')[0]
    // Set the filter value
    firstFiltersRowColumn.$('input').value(companyName)
  }

  void selectCompanyByName(String companyName) {
    companyName = companyName.replace("\"", "")
    // Filter the list of companies to the one we want. Solves the issue of pagination hiding our target company.
    setCompanyNameFilter(companyName)
    // Only 1 company should remain, get the anchor from the matching row and click it
    companiesTable.$('.rt-tbody').$('a', text:companyName).click()
  }
}
