import geb.spock.GebReportingSpec
import pages.app.AccountActivityPage
import pages.app.AccountActivityPage
import pages.app.AdministrationPage
import pages.app.DashboardPage
import pages.app.FuelSuppliersPage
import pages.app.LoginPage
import pages.app.NotificationsPage
import pages.app.SettingsPage
import pages.external.Accessability
import pages.external.Copyright
import pages.external.Disclaimer
import pages.external.Privacy
import spock.lang.*


@Stepwise
@Title("Page navigation Tests")
class FlowSpecs extends GebReportingSpec {

     def "Login Once"(){
        when: "I go to the TFRS URL "
            go baseUrl
        and: "I log in on the SiteMinder Login page"    
            at LoginPage
            userName.value("Rstens")
            passWord.value("Tfrs01Testing!")
            logIn.click()
        then: "I will arrive at the TFRS Dashboard"    
            at DashboardPage
    }

    @Unroll
    def "Navigate Page from: #startPage, click Link: #clickLink, Assert Page: #assertPage"(){
        when: "I am on #startPage"
            to startPage
        and: "I click on #clickLink"
            $("a", id:"$clickLink").click()
        then: "I should see #assertPage"
            at assertPage
        where:
            startPage           | clickLink                     || assertPage
            DashboardPage       | "navbar-organizations"        || FuelSuppliersPage
            DashboardPage       | "navbar-account-activity"     || AccountActivityPage
            DashboardPage       | "navbar-notifications"        || NotificationsPage
            DashboardPage       | "navbar-settings"             || SettingsPage
            DashboardPage       | "navbar-administration"       || AdministrationPage
            FuelSuppliersPage   | "navbar-dashboard"            || DashboardPage
            AccountActivityPage | "navbar-dashboard"            || DashboardPage
            NotificationsPage   | "navbar-dashboard"            || DashboardPage
            SettingsPage        | "navbar-dashboard"            || DashboardPage        
            AdministrationPage  | "navbar-dashboard"            || DashboardPage
            DashboardPage       | "navbar-dashboard"            || DashboardPage
            //Test Externally Linked Pages
            FuelSuppliersPage   | "footer-home"                 || DashboardPage
            AccountActivityPage | "footer-about-site"           || DashboardPage
            DashboardPage       | "footer-about-disclaimer"     || Disclaimer
            DashboardPage       | "footer-about-privacy"        || Privacy
            DashboardPage       | "footer-about-accessibility"  || Accessability
            DashboardPage       | "footer-about-copyright"      || Copyright
            SettingsPage        | "footer-about-contact"        || DashboardPage
    }
}
