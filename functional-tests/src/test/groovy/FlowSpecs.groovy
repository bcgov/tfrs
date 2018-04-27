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
            startPage                | clickLink                     || assertPage
            DashboardPage            | "navbar-credit-transactions"  || CreditTransactionsPage
    }
}
