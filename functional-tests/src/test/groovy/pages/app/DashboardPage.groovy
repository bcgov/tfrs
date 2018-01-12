package pages.app

import geb.Page
import extensions.ReactJSAware

class DashboardPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $("h2")[0].text() == "Account Balance" }
    static url = "#/"
    static content = {
        displayname { $("span", id:"display_name") }
    }
}
