package pages.app

import geb.Page
import extensions.ReactJSAware

class SettingsPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $("h2").text() == "Notification Settings" }
    static url = "#/settings"
    static content = {
        
    }
}
