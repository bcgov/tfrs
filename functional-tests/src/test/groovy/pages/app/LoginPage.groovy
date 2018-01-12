package pages.app

import geb.Page

class LoginPage extends Page {
    static at = { title == "Government of British Columbia" && $("#login-to").text() == "Log in to dev.lowcarbonfuels.gov.bc.ca"}
    //static url = ""
    static content = {
        userName { $("#user") }
        passWord {  $("#password") }
        logIn { $("input", type:"submit", value:"Continue") }
    }
}

