import geb.spock.GebReportingSpec
import pages.app.DashboardPage
import pages.app.LoginPage
import spock.lang.Unroll

class LoginSpecs extends GebReportingSpec {

    def "Login with BCEID"(){
        given: "I want to access TFRS"
            go baseUrl
        when: "I open the url for TFRS, I land on the BCEID login page"
            at LoginPage
        and: "when I login"
            userName.value("Rstens")
            passWord.value("Tfrs01Testing!")
            logIn.click()
        then: "I should see the TFRS Dashboard"
            at DashboardPage
        and: "the full displayname of the logged-in user should be shown"    
            assert userDiplayname.text() == "Roland Stens"
    }
}
