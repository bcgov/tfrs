package pages

class OrganizationAddPage extends BaseAppPage {
  static at = { isReactReady() && pageTitle.text() == 'Create Organization' }
  static url = '/organizations/add'
  static content = {
    pageTitle { $('#main .organization-edit-details h1') }

    nameField { $('#organization-name') }
    typeDropdown { $('#organization-type') }
    actionsTypeDropdown { $('#organization-actions-type') }
    statusDropdown { $('#organization-status') }
    addressLine1Field { $('#organization-address-line-1') }
    addressLine2Field { $('#organization-address-line-2') }
    addressLine3Field { $('#organization-address-line-3') }
    cityField { $('#organization-city') }
    postalCodeField { $('#organization-postal-code') }
    countyField { $('#organization-county') }
    stateField { $('#organization-state') }
    countryField { $('#organization-country') }

    saveButton { $('#save-organization')}
  }

  void setNameField(String name) {
    nameField.value(name)
  }

  void setType(String type) {
    typeDropdown.$('option', text:type).click()
  }

  void setActionsType(String actionType) {
    actionsTypeDropdown.$('option', text:actionType).click()
  }

  void setStatus(String status) {
    statusDropdown.$('option', text:status).click()
  }

  void setAddressLine1(String addressLine1) {
    addressLine1Field.value(addressLine1)
  }

  void setAddressLine2(String addressLine2) {
    addressLine2Field.value(addressLine2)
  }

  void setAddressLine3(String addressLine3) {
    addressLine3Field.value(addressLine3)
  }

  void setCity(String city) {
    cityField.value(city)
  }

  void setPostalCode(String postalCode) {
    postalCodeField.value(postalCode)
  }

  void setCounty(String county) {
    countyField.value(county)
  }

  void setState(String state) {
    stateField.value(state)
  }

  void setCountry(String country) {
    countryField.value(country)
  }

  void clickSaveButton() {
    saveButton.click()
  }
}
