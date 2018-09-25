package specs

import pages.CreditTransactionsAddPage
import pages.CreditTransactionsPage
import pages.CreditTransactionsConfirmSubmitModal
import pages.NotificationsPage
import pages.CreditTransactionsViewPage
import pages.CreditTransactionsConfirmAcceptModal
import pages.CreditTransactionsConfirmRecommendModal
import pages.CreditTransactionsConfirmApproveModal

import spock.lang.Timeout
import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise

@Timeout(300)
@Stepwise
@Title('Credit Transfer Test')
@Narrative('''As a fuel supplier, I want to transfer credits to another fuel supplier.''')
class CreditTransferSpec extends LoggedInSpec {
  void 'Log in as the sending fuel supplier and initiate a new credit transfer'() {
    given: 'I am logged in as the sending fuel supplier'
      logInAsSendingFuelSupplier()
    and: 'I populate all required fields for a new credit transfer'
      to CreditTransactionsAddPage
      setTransactionType('Buy')
      setNumberOfCredits(1000)
      setRespondent('Fuel Supplier 2')
      setPricePerCredit(2)
      checkTerms()
      addComment('Log in as the sending fuel supplier and initiate a new credit transfer')
    when: 'I sign 1 of 2 and submit the transfer'
      signCreditTransfer()
      page(CreditTransactionsConfirmSubmitModal)
      confirmCreditTransaction()
    then: 'The credit transfer is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 1 notification'
      headerModule.getNotificationCount() == 1
  }

  void 'Log in as the receiving fuel supplier and accept the credit transfer'() {
    given: 'I am logged in as the receiving fuel supplier'
      logInAsReceivingFuelSupplier()
    and: 'I populate all required fields to accept the proposed credit transfer'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Signed 1/2').click()
      page(CreditTransactionsViewPage)
      checkTerms()
      addComment('Log in as the receiving fuel supplier and accept the credit transfer')
    when: 'I sign 2 of 2 and submit the transfer'
      signCreditTransfer()
      page(CreditTransactionsConfirmAcceptModal)
      confirmCreditTransaction()
    then: 'The credit transfer is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 2 notifications'
      headerModule.getNotificationCount() == 2
  }

  void 'Log in as an analyst and recommend the credit transfer'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
    and: 'I populate all required fields to recommend the accepted credit transfer'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Signed 2/2').click()
      page(CreditTransactionsViewPage)
      addComment('Log in as an analyst and recommend the credit transfer')
      addInternalComment('Log in as an analyst and recommend the credit transfer')
    when:
      recommendCreditTransfer()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The credit transfer is recommended and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 2 notifications'
      headerModule.getNotificationCount() == 2
  }

  void 'Log in as a Director and recommend the credit transfer'() {
    given: 'I am logged in as an Analyst'
      logInAsDirector()
    and: 'I populate all required fields to recommend the accepted credit transfer'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Recommended For Approval').click()
      page(CreditTransactionsViewPage)
      addComment('Log in as a Director and recommend the credit transfer')
      addInternalComment('Log in as a Director and recommend the credit transfer')
    when:
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The credit transfer is approved and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 3 notifications'
      headerModule.getNotificationCount() == 3
  }
}
