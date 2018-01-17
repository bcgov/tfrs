package pages.app

import geb.Page
import extensions.ReactJSAware

class NotificationsPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $("h1")[1].text() == "Notifications" }
    static url = "#/notifications"

    static content = {
        heading { $("h1")[1].text() }
    }
}
