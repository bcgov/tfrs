package pages.app

import geb.Page
import extensions.ReactJSAware

class AccountActivityPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $("h1.header").text() == "Account Activity" }
    static url = "account-activity"

    static content = {
            header { $("h1.header").text() }
    }
}
