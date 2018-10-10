package specs

import pages.NewCreditTransactionPage
import pages.CreditTransactionsConfirmRecommendModal
import pages.CreditTransactionsConfirmApproveModal
import pages.CreditTransactionsPage
import pages.NotificationsPage
import pages.CreditTransactionsViewPage
import pages.ToastModal
import pages.HomePage

import spock.lang.Timeout
import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise

@Timeout(300)
@Stepwise
@Title('Credit Transaction Test')
@Narrative('''As an analyst, I want to award, validate, and reduce credits for fuel suppliers.''')
class CreditTransactionSpec extends LoggedInSpec {

  // Part 3 Award

  void 'Log in as an analyst and initiate a new part 3 award credit transaction'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new part 3 award'
      to NewCreditTransactionPage
      setTransactionType('Part 3 Award')
      setRespondent(getReceivingFuelSupplier().org)
      setNumberOfCredits(50)
      setCompliancePeriod('2018')
      addComment('Log in as an analyst and initiate a new part 3 award credit transaction')
    when: 'I recommend and confirm the transaction'
      recommendCreditTransaction()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The part 3 award credit transaction is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 1 notification'
      at new ToastModal('Success!', 'Credit transaction recommended.')
      page(HomePage)
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }

  void 'Log in as a Director and approve the part 3 award credit transaction'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended part 3 award credit transaction'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Part 3 Award'))
      addComment('Log in as a Director and approve the part 3 award credit transaction')
      addInternalComment('Log in as a Director and approve the part 3 award credit transaction')
    when: 'I approve and confirm the transaction'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The part 3 award credit transaction is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 2 notifications'
      at new ToastModal('Success!', 'Credit transaction approved.')
      page(HomePage)
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }

  // Validation

  void 'Log in as an analyst and initiate a new validation credit transaction'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new validation'
      to NewCreditTransactionPage
      setTransactionType('Validation')
      setRespondent(getReceivingFuelSupplier().org)
      setNumberOfCredits(60)
      setCompliancePeriod('2018')
      addComment('Log in as an analyst and initiate a new validation credit transaction')
    when: 'I recommend and confirm the transaction'
      recommendCreditTransaction()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The validation credit transaction is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 1 notification'
      at new ToastModal('Success!', 'Credit transaction recommended.')
      page(HomePage)
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }

  void 'Log in as a Director and approve the validation credit transaction'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended validation credit transaction'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Validation'))
      addComment('Log in as a Director and approve the validation credit transaction')
      addInternalComment('Log in as a Director and approve the validation credit transaction')
    when: 'I approve and confirm the transaction'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The validation credit transaction is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 2 notifications'
      at new ToastModal('Success!', 'Credit transaction approved.')
      page(HomePage)
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }

  // Reduction

  void 'Log in as an analyst and initiate a new reduction credit transaction'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new reduction'
      to NewCreditTransactionPage
      setTransactionType('Reduction')
      setRespondent(getReceivingFuelSupplier().org)
      setNumberOfCredits(70)
      setCompliancePeriod('2018')
      addComment('Log in as an analyst and initiate a new reduction credit transaction')
    when: 'I recommend and confirm the transaction'
      recommendCreditTransaction()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The reduction credit transaction is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 1 notification'
      at new ToastModal('Success!', 'Credit transaction recommended.')
      page(HomePage)
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }

  void 'Log in as a Director and approve the reduction credit transaction'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      def initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended reduction credit transaction'
      to NotificationsPage
      getCreditTransferLinkByText('Credit Transfer Proposal Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Reduction'))
      addComment('Log in as a Director and approve the reduction credit transaction')
      addInternalComment('Log in as a Director and approve the reduction credit transaction')
    when: 'I approve and confirm the transaction'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The reduction credit transaction is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I have 2 notifications'
      at new ToastModal('Success!', 'Credit transaction approved.')
      page(HomePage)
      headerModule.compareNotificationCounts(initialNotificationCount+1)
  }
}
