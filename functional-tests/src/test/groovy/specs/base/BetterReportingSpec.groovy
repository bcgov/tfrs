import geb.spock.GebReportingSpec

class BetterReportingSpec extends GebReportingSpec {

  @Override
  void resetBrowser() {
    def driver = browser.driver
    super.resetBrowser()
    driver.quit()
  }

}
