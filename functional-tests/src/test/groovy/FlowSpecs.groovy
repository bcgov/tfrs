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
            go "https://logontest.gov.bc.ca/clp-cgi/capBceid/logon.cgi?flags=1101:1,7&TYPE=33554433&REALMOID=06-7a693a2b-07ab-481f-ae38-e9cccc861e78&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=5SlxkAjMjyMfuL59wytntBoF3Ika3c1xW%2bUVeexhRKy8oHb7NkxEL5YuGJpnQIWjoZCSSfSPxRYnEVatgnfxz91irpUOq%2bJ%2f&TARGET=https%3a%2f%2fdev%2elowcarbonfuels%2egov%2ebc%2eca%2f"
        and: "I log in on the SiteMinder Login page"    
            at LoginPage
            userName.value("Rstens")
            passWord.value("Tfrs01Testing!")
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
        and: "I click on #clickLink"
            $("a", id:"$clickLink").click()
        then: "I should see #assertPage"
            at assertPage
        where:
            startPage                | clickLink                     || assertPage
            DashboardPage            | "navbar-credit-transactions"  || CreditTransactionsPage
    }
}
