package specs

import pages.NewCreditTransferPage
import pages.CreditTransactionsPage
import pages.CreditTransactionsConfirmSubmitModal
import pages.NotificationsPage
import pages.CreditTransactionsViewPage
import pages.CreditTransactionsConfirmAcceptModal
import pages.CreditTransactionsConfirmRecommendModal
import pages.CreditTransactionsConfirmApproveModal
import pages.ToastModal

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
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new credit transfer'
      to NewCreditTransferPage
      setTransactionType('Buy')
      setNumberOfCredits(80)
      setRespondent(getReceivingFuelSupplier().org)
      setPricePerCredit(2)
      checkTerms()
      addComment('Log in as the sending fuel supplier and initiate a new credit transfer')
    when: 'I sign 1 of 2 and submit the transfer'
      signCreditTransfer()
      page(CreditTransactionsConfirmSubmitModal)
      submitCreditTransaction()
    then: 'The credit transfer is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'My unread notification count has increased by 1'
      at new ToastModal('Success!', 'Credit Transfer Proposal sent.')
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }

  void 'Log in as the receiving fuel supplier and accept the credit transfer'() {
    given: 'I am logged in as the receiving fuel supplier'
      logInAsReceivingFuelSupplier()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to accept the proposed credit transfer'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Signed 1/2').click()
      page(new CreditTransactionsViewPage('Credit Transfer'))
      checkTerms()
      addComment('Log in as the receiving fuel supplier and accept the credit transfer')
    when: 'I sign 2 of 2 and submit the transfer'
      signCreditTransfer()
      page(CreditTransactionsConfirmAcceptModal)
      acceptCreditTransaction()
    then: 'The credit transfer is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'My unread notification count has not increased'
      at new ToastModal('Success!', 'Credit Transfer Proposal accepted.')
      headerModule.compareNotificationCounts(initialNotificationCount)
  }

  void 'Log in as an analyst and recommend the credit transfer'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to recommend the accepted credit transfer'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Signed 2/2').click()
      page(new CreditTransactionsViewPage('Credit Transfer'))
      addComment('Log in as an analyst and recommend the credit transfer')
      addInternalComment('Log in as an analyst and recommend the credit transfer')
    when: 'I recommend and confirm the transfer'
      recommendCreditTransfer()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The credit transfer is recommended and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'My unread notification count has not increased'
      at new ToastModal('Success!', 'Credit Transfer Proposal recommended.')
      headerModule.compareNotificationCounts(initialNotificationCount)
  }

  void 'Log in as a Director and approve the credit transfer'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended credit transfer'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Credit Transfer'))
      addComment('Log in as a Director and approve the credit transfer')
      addInternalComment('Log in as a Director and approve the credit transfer')
    when: 'I approve and confirm the transfer'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The credit transfer is approved and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'My unread notification count has not increased'
      at new ToastModal('Success!', 'Credit Transfer Proposal approved.')
      headerModule.compareNotificationCounts(initialNotificationCount)
  }
}
