package pages

// TODO
class SettingsPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == "Notification Settings" }
  static url = "/settings"
  static content = {
    pageTitle { }
  }
}
