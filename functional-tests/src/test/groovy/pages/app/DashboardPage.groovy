package pages.app

import geb.Page
import extensions.ReactJSAware

class DashboardPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS"}
    static url = ""
}
