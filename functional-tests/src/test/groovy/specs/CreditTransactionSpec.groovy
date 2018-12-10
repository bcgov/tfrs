package specs

import pages.NewCreditTransactionPage
import pages.CreditTransactionsConfirmRecommendModal
import pages.CreditTransactionsConfirmApproveModal
import pages.CreditTransactionsPage
import pages.NotificationsPage
import pages.CreditTransactionsViewPage
import pages.ToastModal
import pages.HomePage

import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise
import spock.lang.Shared

@Stepwise
@Title('Credit Transaction Test')
@Narrative('''As an analyst, I want to award, validate, and reduce credits for fuel suppliers.''')
class CreditTransactionSpec extends LoggedInSpec {

  @Shared
  Integer receivingFuelSupplier_initialCreditBalance

  def setupSpec() {
    logInAsReceivingFuelSupplier()
    receivingFuelSupplier_initialCreditBalance = getCreditBalance()
    clearAndResetBrowser()
  }


  void 'Log in as a Director and download the credit transactions as XLS'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
    and: 'I am at the Transactions Page'
      at CreditTransactionsPage
    when: 'I click on the Download button'
      clickDownloadButton()
    then: 
      getDownloadButtonText() == 'Downloading...'
      sleep(10000)
    and:
      getDownloadButtonText() == 'Download as .xls'
  }
}
