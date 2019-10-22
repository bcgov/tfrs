package specs

import pages.HomePage
import pages.NewCreditTransferPage
import pages.CreditTransactionsPage
import pages.ConfirmSubmitModal
import pages.NotificationsPage
import pages.CreditTransactionsViewPage
import pages.CreditTransactionsConfirmAcceptModal
import pages.CreditTransactionsConfirmRecommendModal
import pages.CreditTransactionsConfirmApproveModal
import pages.ToastModal

import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise
import spock.lang.Shared
import pages.HomePage

@Stepwise
@Title('Credit Transfer Test')
@Narrative('''As a fuel supplier, I want to transfer credits to another fuel supplier.''')
class SimpleSpec extends LoggedInSpec {

  void 'Log in as the sending fuel supplier and verify the first page'() {

    when: 'I am logged in as the sending fuel supplier'
        logInAsSendingFuelSupplier2()
    then: 'I am on home page'
        at HomePage2

  }

}
