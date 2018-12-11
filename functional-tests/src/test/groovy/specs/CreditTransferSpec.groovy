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

@Stepwise
@Title('Credit Transfer Test')
@Narrative('''As a fuel supplier, I want to transfer credits to another fuel supplier.''')
class CreditTransferSpec extends LoggedInSpec {

  @Shared
  Integer sendingFuelSupplier_initialCreditBalance

  @Shared
  Integer receivingFuelSupplier_initialCreditBalance

  void 'Log in as the sending fuel supplier and initiate a new credit transfer'() {
    given: 'I am logged in as the sending fuel supplier'
      logInAsSendingFuelSupplier()
      Integer initialNotificationCount = headerModule.getNotificationCount(10)
      sendingFuelSupplier_initialCreditBalance = getCreditBalance()
    and: 'I populate all required fields for a new credit transfer'
      to NewCreditTransferPage
      setTransactionType('Sell')
      setNumberOfCredits(98)
      setRespondent(getReceivingFuelSupplier().org)
      setPricePerCredit(2)
      checkTerms()
      addComment('Log in as the sending fuel supplier and initiate a new credit transfer')
    when: 'I sign 1 of 2 and submit the transfer'
      signCreditTransfer()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The credit transfer is initiated and I am returned to the Credit Transactions page'
      at CreditTransactionsPage
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit Transfer Proposal sent.')
    and: 'My unread notification count has increased by 1'
      waitFor {
        headerModule.getNotificationCount() == initialNotificationCount+1
      }
    and: 'My credit balance has not changed'
      page(HomePage)
      getCreditBalance() == sendingFuelSupplier_initialCreditBalance
  }

  void 'Log in as the receiving fuel supplier and accept the credit transfer'() {
    given: 'I am logged in as the receiving fuel supplier'
      logInAsReceivingFuelSupplier()
      Integer initialNotificationCount = headerModule.getNotificationCount(10)
      receivingFuelSupplier_initialCreditBalance = getCreditBalance()
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
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit Transfer Proposal accepted.')
    and: 'My unread notification count has not increased'
      waitFor {
        headerModule.getNotificationCount() == initialNotificationCount
      }
    and: 'My credit balance has not changed'
      page(HomePage)
      getCreditBalance() == receivingFuelSupplier_initialCreditBalance
  }

  void 'Log in as an analyst and recommend the credit transfer'() {
    given: 'I am logged in as an Analyst'
      logInAsAnalyst()
      Integer initialNotificationCount = headerModule.getNotificationCount(10)
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
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit Transfer Proposal recommended.')
    and: 'My unread notification count has not increased'
      waitFor {
        headerModule.getNotificationCount() == initialNotificationCount
      }
  }

  void 'Log in as a Director and approve the credit transfer'() {
    given: 'I am logged in as a Director'
      logInAsDirector()
      Integer initialNotificationCount = headerModule.getNotificationCount(10)
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
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Credit Transfer Proposal approved.')
    and: 'My unread notification count has not increased'
      waitFor {
        headerModule.getNotificationCount() == initialNotificationCount
      }
  }

  void 'Log in as the sending fuel supplier and verify my credit balance has decreased'() {
    given: 'I am logged in as the sending fuel supplier'
      logInAsSendingFuelSupplier()
    when: 'I have previously successfully transferred credits to another fuel supplier'
    then: 'My credit balance is decreased by the amount transferred'
      getCreditBalance() == sendingFuelSupplier_initialCreditBalance - 98
  }

  void 'Log in as the receiving fuel supplier and verify my credit balance has increased'() {
    given: 'I am logged in as the receiving fuel supplier'
      logInAsReceivingFuelSupplier()
    when: 'I have previously successfully been transferred credits from another fuel supplier'
    then: 'My credit balance is increased by the amount transferred'
      getCreditBalance() == receivingFuelSupplier_initialCreditBalance + 98
  }
}
