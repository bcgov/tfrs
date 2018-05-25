import geb.spock.GebReportingSpec
import pages.app.CreditTransactionsPage
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
        when: "I go to the Login URL "
            go "https://logontest.gov.bc.ca/clp-cgi/capBceid/logon.cgi?TARGET=https://dev.lowcarbonfuels.gov.bc.ca/&flags=1101:1,7&toggle=1"
        and: "I log in on the SiteMinder Login page"    
            def env = System.getenv()
            at LoginPage
            userName.value(env['FT_USERNAME'])
            passWord.value(env['FT_PASSWORD'])
            logIn.click()
        and: "I go to the TFRS Dashboard"
            go baseUrl
        then: "I will arrive at the TFRS Dashboard"    
            at DashboardPage
    }

    @Unroll
    def "Navigate Page from: #startPage, click Link: #clickLink, Assert Page: #assertPage"(){
        when: "I am on #startPage"
            to startPage
        then: "I should see #assertPage"
            at assertPage
        where:
            startPage                | clickLink                     || assertPage
            DashboardPage            | "navbar-credit-transactions"  || CreditTransactionsPage
    }
}
