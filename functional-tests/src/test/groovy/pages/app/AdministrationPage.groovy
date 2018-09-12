package pages

// TODO
class AdministrationPage extends BaseAppPage {
  static at = { reactReady && pageTitle.text() == "Administration"  }
  static url = "/administration"
  static content = {
    pageTitle { }
  }
}
