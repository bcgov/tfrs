import geb.spock.GebReportingSpec
import pages.app.DashboardPage
import pages.app.NotificationsPage
import pages.app.SettingsPage
import pages.app.AccountActivityPage
import pages.app.OpportunitiesPage
import pages.app.FuelSuppliersPage
import pages.app.AdministrationPage
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
        (1..clickCount).each{
            $("a", id:"$clickLink").click()
        }

        then:
        at assertPage

        where:
        startPage           | clickLink                     | clickCount    | timeoutSeconds    || assertPage
        //DashboardPage       | "navbar-notifications"        | 1             | 3                 || NotificationsPage
        //SettingsPage        | "navbar-notifications"        | 1             | 3                 || NotificationsPage
        //NotificationsPage   | "navbar-settings"             | 1             | 3                 || SettingsPage
        //DashboardPage       | "account-activity-view-all"   | 1             | 3                 || AccountActivityPage
        //DashboardPage       | "navbar-fuel-suppliers"       | 1             | 3                 || FuelSuppliersPage
        //DashboardPage       | "navbar-account-activity"     | 1             | 3                 || AccountActivityPage
        //DashboardPage       | "navbar-opportunities"        | 1             | 3                 || OpportunitiesPage
        //DashboardPage       | "navbar-administration"       | 1             | 3                 || AdministrationPage

        //Test Externally Linked Pages
        SettingsPage      | "footer-about-copyright"        | 1             | 3                 || Copyright
        SettingsPage      | "footer-about-disclaimer"       | 1             | 3                 || Disclaimer
        SettingsPage      | "footer-about-privacy"          | 1             | 3                 || Privacy
        SettingsPage      | "footer-about-accessibility"    | 1             | 3                 || Accessability
    }
}
