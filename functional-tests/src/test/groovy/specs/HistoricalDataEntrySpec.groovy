package specs

import pages.HistoricalDataEntryPage
import pages.HistoricalDataEntryConfirmProcessModal

import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise
import spock.lang.Shared

@Stepwise
@Title('Historical Data Entry Test')
@Narrative('''As an analyst, I want to enter historical data.''')
class HistoricalDataEntrySpec extends LoggedInSpec {

  @Shared
  Integer sendingFuelSupplier_initialCreditBalance

  @Shared
  Integer receivingFuelSupplier_initialCreditBalance

  def setupSpec() {
    logInAsSendingFuelSupplier()
    sendingFuelSupplier_initialCreditBalance = getCreditBalance()
    clearAndResetBrowser()

    logInAsReceivingFuelSupplier()
    receivingFuelSupplier_initialCreditBalance = getCreditBalance()
    clearAndResetBrowser()
  }

  // Credit Transfer
  // TODO - Add tests for Zero Dollar Reason? 1. Affiliate 2. Other

  void 'Log in as an analyst and create a new historical data entry for a non-zero dollar credit transfer'() {
    given: 'I am logged in as an analyst'
      logInAsAnalyst()
    and: 'I populate all required fields for a new historical data entry for a credit transfer'
      to HistoricalDataEntryPage
      setEffectiveDate('10', '10', '2018')
      setNumberOfCredits(10)
      setTransactionType('Credit Transfer')
      setPricePerCredit(1)
      setCreditsFrom(getSendingFuelSupplier().org)
      setCreditsTo(getReceivingFuelSupplier().org)
      setCompliancePeriod('2018')
      setNote('Log in as an analyst and create a new historical data entry for a credit transfer')
    when: 'I add the transaction to the queue, commit it, and confirm it'
      clickAddToQueueButton()
      clickCommitButton()
      page(HistoricalDataEntryConfirmProcessModal)
      confirmHistoricalDataEntry(true)
    then: 'The historical data entry for a credit transfer is initiated and a success alert is displayed'
      page(HistoricalDataEntryPage)
      commitSuccessAlertDisplayed()
  }

  // Part 3 Award

  void 'Log in as an analyst and create a new historical data entry for a part 3 award'() {
    given: 'I am logged in as an analyst'
      logInAsAnalyst()
    and: 'I populate all required fields for a new historical data entry for a part 3 award'
      to HistoricalDataEntryPage
      setEffectiveDate('10', '10', '2018')
      setNumberOfCredits(20)
      setTransactionType('Part 3 Award')
      setCreditsTo(getReceivingFuelSupplier().org)
      setCompliancePeriod('2018')
      setNote('Log in as an analyst and create a new historical data entry for a part 3 award')
    when: 'I add the transaction to the queue, commit it, and confirm it'
      clickAddToQueueButton()
      clickCommitButton()
      page(HistoricalDataEntryConfirmProcessModal)
      confirmHistoricalDataEntry(true)
    then: 'The historical data entry for a credit transfer is initiated and a success alert is displayed'
      page(HistoricalDataEntryPage)
      commitSuccessAlertDisplayed()
  }

  // Validation

  void 'Log in as an analyst and create a new historical data entry for a validation'() {
    given: 'I am logged in as an analyst'
      logInAsAnalyst()
    and: 'I populate all required fields for a new historical data entry for a validation'
      to HistoricalDataEntryPage
      setEffectiveDate('10', '10', '2018')
      setNumberOfCredits(40)
      setTransactionType('Validation')
      setCreditsTo(getReceivingFuelSupplier().org)
      setCompliancePeriod('2018')
      setNote('Log in as an analyst and create a new historical data entry for a validation')
    when: 'I add the transaction to the queue, commit it, and confirm it'
      clickAddToQueueButton()
      clickCommitButton()
      page(HistoricalDataEntryConfirmProcessModal)
      confirmHistoricalDataEntry(true)
    then: 'The historical data entry for a credit transfer is initiated and a success alert is displayed'
      page(HistoricalDataEntryPage)
      commitSuccessAlertDisplayed()
  }

  // Reduction

  void 'Log in as an analyst and create a new historical data entry for a reduction'() {
    given: 'I am logged in as an analyst'
      logInAsAnalyst()
    and: 'I populate all required fields for a new historical data entry for a reduction'
      to HistoricalDataEntryPage
      setEffectiveDate('10', '10', '2018')
      setNumberOfCredits(80)
      setTransactionType('Reduction')
      setCreditsFrom(getReceivingFuelSupplier().org)
      setCompliancePeriod('2018')
      setNote('Log in as an analyst and create a new historical data entry for a reduction')
    when: 'I add the transaction to the queue, commit it, and confirm it'
      clickAddToQueueButton()
      clickCommitButton()
      page(HistoricalDataEntryConfirmProcessModal)
      confirmHistoricalDataEntry(true)
    then: 'The historical data entry for a credit transfer is initiated and a success alert is displayed'
      page(HistoricalDataEntryPage)
      commitSuccessAlertDisplayed()
  }

  // Verify credit balances after all 4 above transactions completed

  void 'Log in as the sending fuel supplier and verify my credit balance has decreased'() {
    given: 'I am logged in as the sending fuel supplier'
      logInAsSendingFuelSupplier()
    when: 'I have previously successfully transferred credits to another fuel supplier'
    then: 'My credit balance is decreased by the amount transferred'
      getCreditBalance() == sendingFuelSupplier_initialCreditBalance - 10
  }

  void 'Log in as the receiving fuel supplier and verify my credit balance was updated correctly'() {
    given: 'I am logged in as the receiving fuel supplier'
      logInAsReceivingFuelSupplier()
    when: 'I have previously successfully been awarded credits, had credits validated, and had credits reduced'
    then: 'My credit balance was updated correctly based on the amounts transferred, awarded, validated, and reduced'
      getCreditBalance() == receivingFuelSupplier_initialCreditBalance + 10 + 20 + 40 - 80
  }
}
