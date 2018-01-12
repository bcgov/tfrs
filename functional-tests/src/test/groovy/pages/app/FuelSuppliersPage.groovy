package pages.app

import geb.Page
import extensions.ReactJSAware

class FuelSuppliersPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $("h1")[1].text() == "Organizations" }
    static url = "#/organizations"

    static content = {
        header { $("h1")[1].text() }
        addButton { $("button")[1] }
        activeOnlyCB { $("input", type:"checkbox") }
    }
}
