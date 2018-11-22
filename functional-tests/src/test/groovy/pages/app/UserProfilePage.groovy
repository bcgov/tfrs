package pages

class UserProfilePage extends BaseAppPage {
  static at = {
    isReactReady() &&
    // Match urls for regular and admin users profile pages to avoid duplicating this class.
    browser.getCurrentUrl() =~ /(admin)?\/users\/(view|view_by_username)\/(user)?[0-9]+$/ &&
    pageTitle.text() == expectedPageTitle
  }
  static content = {
    pageTitle { $('#main .page_user h1') }

    editButton { $('#edit-user')}
  }

  private final String expectedPageTitle

  /**
   * Constructor.
   *
   * @param String expectedPageTitle the expected page title.
   */
  UserProfilePage(String expectedPageTitle) {
    this.expectedPageTitle = expectedPageTitle
  }

  void clickEditButton() {
    editButton.click()
  }
}
