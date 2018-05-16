package pages.app

import geb.Page
import extensions.ReactJSAware

class CreditTransactionsPage extends Page implements ReactJSAware {
    static at = { reactReady && title == "TFRS" && $(".page_credit_transactions h1").text() == "Credit Transactions" }
    static url = "/credit_transactions"

    static content = {
            header { $(".page_credit_transactions h1").text() }
    }
}
