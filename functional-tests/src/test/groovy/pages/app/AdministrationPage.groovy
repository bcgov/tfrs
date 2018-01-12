package pages.app

import geb.Page
import extensions.ReactJSAware

class AdministrationPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $("h1")[1].text() == "Administration"  }
    static url = "#/administration"
    static content = {
        
    }
}
