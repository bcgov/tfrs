package pages

// TODO
class FuelSuppliersPage extends BaseAppPage {
  static at = { reactReady && pageTitle.text() == "Organizations" }
  static url = "/organizations"
  static content = {
    pageTitle { }
  }
}
