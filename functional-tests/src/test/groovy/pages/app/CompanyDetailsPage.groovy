package pages

class CompanyDetailsPage extends BaseAppPage {
  // page title text is dynamic, but should match the user organization
  static at = { isReactReady() && pageTitle.text() == headerModule.userOrganization.text() }
  static url = '/organizations/mine'
  static content = {
    pageTitle { $('#main .page_organization h1') }
  }
}
