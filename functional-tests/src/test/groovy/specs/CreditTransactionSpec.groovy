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

  // Part 3 Award

  void 'Log in as an analyst and initiate a new part 3 award credit transaction'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      Integer initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new part 3 award'
      to NewCreditTransactionPage
      setTransactionType('Part 3 Award')
      setRespondent(getReceivingFuelSupplier().org)
      setNumberOfCredits(11)
      setCompliancePeriod('2018')
      addComment('Log in as an analyst and initiate a new part 3 award credit transaction')
    when: 'I recommend and confirm the transaction'
      recommendCreditTransaction()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The part 3 award credit transaction is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit transaction recommended.')
    and: 'My unread notification count has increased by 1'
      page(HomePage)
      headerModule.getNotificationCount() == initialNotificationCount+1
  }

  void 'Log in as a Director and approve the part 3 award credit transaction'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      Integer initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended part 3 award credit transaction'
      to NotificationsPage
      getCreditTransferLinkByText('PVR Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Part 3 Award'))
      addComment('Log in as a Director and approve the part 3 award credit transaction')
      addInternalComment('Log in as a Director and approve the part 3 award credit transaction')
    when: 'I approve and confirm the transaction'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The part 3 award credit transaction is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit transaction approved.')
    and: 'My unread notification count has increased by 1'
      page(HomePage)
      headerModule.getNotificationCount() == initialNotificationCount
  }

  // Validation

  void 'Log in as an analyst and initiate a new validation credit transaction'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      Integer initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new validation'
      to NewCreditTransactionPage
      setTransactionType('Validation')
      setRespondent(getReceivingFuelSupplier().org)
      setNumberOfCredits(22)
      setCompliancePeriod('2018')
      addComment('Log in as an analyst and initiate a new validation credit transaction')
    when: 'I recommend and confirm the transaction'
      recommendCreditTransaction()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The validation credit transaction is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit transaction recommended.')
    and: 'My unread notification count has increased by 1'
      page(HomePage)
      headerModule.getNotificationCount() == initialNotificationCount+1
  }

  void 'Log in as a Director and approve the validation credit transaction'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      Integer initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended validation credit transaction'
      to NotificationsPage
      getCreditTransferLinkByText('PVR Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Validation'))
      addComment('Log in as a Director and approve the validation credit transaction')
      addInternalComment('Log in as a Director and approve the validation credit transaction')
    when: 'I approve and confirm the transaction'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The validation credit transaction is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit transaction approved.')
    and: 'My unread notification count has increased by 1'
      page(HomePage)
      headerModule.getNotificationCount() == initialNotificationCount
  }

  // Reduction

  void 'Log in as an analyst and initiate a new reduction credit transaction'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      Integer initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields for a new reduction'
      to NewCreditTransactionPage
      setTransactionType('Reduction')
      setRespondent(getReceivingFuelSupplier().org)
      setNumberOfCredits(44)
      setCompliancePeriod('2018')
      addComment('Log in as an analyst and initiate a new reduction credit transaction')
    when: 'I recommend and confirm the transaction'
      recommendCreditTransaction()
      page(CreditTransactionsConfirmRecommendModal)
      recommendCreditTransaction()
    then: 'The reduction credit transaction is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit transaction recommended.')
    and: 'My unread notification count has increased by 1'
      page(HomePage)
      headerModule.getNotificationCount() == initialNotificationCount+1
  }

  void 'Log in as a Director and approve the reduction credit transaction'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      Integer initialNotificationCount = headerModule.getNotificationCount()
    and: 'I populate all required fields to approve the recommended reduction credit transaction'
      to NotificationsPage
      getCreditTransferLinkByText('PVR Recommended For Approval').click()
      page(new CreditTransactionsViewPage('Reduction'))
      addComment('Log in as a Director and approve the reduction credit transaction')
      addInternalComment('Log in as a Director and approve the reduction credit transaction')
    when: 'I approve and confirm the transaction'
      approveCreditTransfer()
      page(CreditTransactionsConfirmApproveModal)
      approveCreditTransaction()
    then: 'The reduction credit transaction is accepted and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit transaction approved.')
    and: 'My unread notification count has increased by 1'
      page(HomePage)
      headerModule.getNotificationCount() == initialNotificationCount
  }

  // Verify credit balance after all 3 above transactions completed

  void 'Log in as the receiving fuel supplier and verify my credit balance was updated correctly'() {
    given: 'I am logged in as the receiving fuel supplier'
      logInAsReceivingFuelSupplier()
    when: 'I have previously successfully been awarded credits, had credits validated, and had credits reduced'
    then: 'My credit balance was updated correctly based on the amounts awarded, validated, and reduced'
      getCreditBalance() == receivingFuelSupplier_initialCreditBalance + 11 + 22 - 44
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
