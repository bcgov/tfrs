package pages

import org.openqa.selenium.Keys

class HistoricalDataEntryPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Historical Data Entry' }
  static url = '/admin/historical_data_entry'
  static content = {
    pageTitle { $('#main .page_historical_data_entry h1') }

    effectiveDateField { $('#effective-date') }
    numberOfCreditsField { $('#number-of-credits') }
    transactionTypeButtons { $('#transaction-type') }
    pricePerCreditField { $('#value-per-credit') }
    creditsFromDropdown { $('#credits-from') }
    creditsToDropdown { $('#credits-to') }
    compliancePeriodDropdown { $('#compliance-period') }
    zeroDollarReasonButtons { $('#zero-dollar-reason') } //TODO add ID for group
    noteField { $('#comment') }

    addToQueueButton { $('button', type:'submit', text:'Add to Queue') }

    queueTable(wait:true) { $('.ReactTable') }

    commitButton { $('button', type:'button', text:'Commit') }

    commitSuccessAlert(required:false) { $('.page_historical_data_entry .alert.alert-success') } //TODO add ID
  }

  void setEffectiveDate(String day, String month, String year) {
    // This is a workaround for an issue where calling: effectiveDateField.value('2018-10-10') appears to correctly set
    // the date, but as soon as another element is interacted with the effective date 'unsets' to be empty again.
    // Calling .value() should work according to the doc, assuming no other javascript is messing with the field.
    effectiveDateField << day
    effectiveDateField << month
    // Setting the day value auto advances to the month, but setting the month does not auto advance to the year.
    // Simulate the user clicking the right arrow to move to the next field.
    effectiveDateField << Keys.ARROW_RIGHT
    effectiveDateField << year
  }

  void setNumberOfCredits(int credits) {
    numberOfCreditsField.value(credits)
  }

  void setTransactionType(String type) {
    transactionTypeButtons.$('button', text:type).click()
  }

  void setPricePerCredit(int price) {
    pricePerCreditField.value(price)
  }

  void setCreditsFrom(String respondentFrom) {
    waitFor { creditsFromDropdown.$('option', text:respondentFrom).click() }
  }

  void setCreditsTo(String respondentTo) {
    waitFor { creditsToDropdown.$('option', text:respondentTo).click() }
  }

  void setZeroDollarReason(String reason) {
    transactionTypeButtons.$('button', text:reason).click()
  }

  void setCompliancePeriod(String period) {
    waitFor { compliancePeriodDropdown.$('option', text:period).click() }
  }

  void setNote(String note) {
    noteField.value(note)
  }

  void clickAddToQueueButton() {
    addToQueueButton.click()
  }

  void clickCommitButton() {
    commitButton.click()
  }

  Boolean commitSuccessAlertDisplayed() {
    waitFor {
      commitSuccessAlert.displayed == true &&
      commitSuccessAlert.$('h1').text() =~ 'Success!'
    }
  }
}
