package pages

class CompanyDetailsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == headerModule.userOrganization.text() } // page title text is dynamic, but should match the user organization
  static url = "/organizations/mine"
  static content = {
    pageTitle { $("#main .page_organization h1") }
  }
}