import geb.spock.GebReportingSpec
import pages.app.DashboardPage
import pages.app.NotificationsPage
import pages.app.FuelSuppliersPage
import pages.app.AccountActivityPage
import pages.external.Accessability
import pages.external.Copyright
import pages.external.Disclaimer
import pages.external.Privacy
import spock.lang.Unroll

class FlowSpecs extends GebReportingSpec {

    @Unroll
    def "Navigate Page from: #startPage, click Link: #clickLink, Assert Page: #assertPage"(){
        when:
        to startPage

        and:
            $("a", id:"$clickLink").click()
        then:
        at assertPage

        where:
        startPage           | clickLink                     || assertPage
        DashboardPage       | "navbar-notifications"        || NotificationsPage
        DashboardPage       | "navbar-organizations"        || FuelSuppliersPage
        //DashboardPage       | "navbar-account-activity"     || AccountActivityPage
        //Test Externally Linked Pages
        DashboardPage        | "footer-about-copyright"     || Copyright
        DashboardPage        | "footer-about-disclaimer"    || Disclaimer
        DashboardPage        | "footer-about-privacy"       || Privacy
        DashboardPage        | "footer-about-accessibility" || Accessability
    }
}
