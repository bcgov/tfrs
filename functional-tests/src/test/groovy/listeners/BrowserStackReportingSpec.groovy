package listeners

import geb.spock.GebReportingSpec
import geb.Browser

class BrowserStackReportingSpec extends GebReportingSpec {

  @Override
  Browser getBrowser() {
    Browser _browser = super.getBrowser()

    if (_browser && _browser.driver) {
      SessionIdHolder.instance.sessionId.set(_browser.driver.getSessionId())
      _browser.driver.manage().window().maximize()
    }



    _browser
  }

  @Override
  void resetBrowser() {
    def driver = browser.driver
    super.resetBrowser()
    driver.quit()
  }

}
