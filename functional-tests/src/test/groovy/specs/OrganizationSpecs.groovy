package specs

import pages.OrganizationsPage
import pages.OrganizationAddPage
import pages.OrganizationViewPage
import pages.OrganizationEditPage
import pages.ConfirmSubmitModal
import pages.ToastModal

import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise
import spock.lang.Shared

@Stepwise
@Title('Organizations Add/Edit Tests')
@Narrative('''As a user, I want to create and update users.''')
class OrganizationSpecs extends LoggedInSpec {

  @Shared
  String organizationName = makeUnique('BDDTestOrg')

  void 'Log in as an Admin and add a new organization'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to OrganizationsPage
    and: 'I click the "Create Organization" button'
      clickCreateOrganizationButton()
      at OrganizationAddPage
    and: 'I populate all required fields to create a new organization'
      sleep(5000)
      setNameField(organizationName)
      setType('A Part 3 Fuel Supplier who can do credit transfers')
      setActionsType('An Organization permitted to only to Sell Low Carbon Credits.')
      setStatus('The Fuel Supplier has been archived and is no longer a participant in the Low Carbon Credits trading market.')
      setAddressLine1('111 city')
      setAddressLine2('222 block')
      setAddressLine3('333 suite')
      setCity('City')
      setPostalCode('A1A1A1')
      setCounty('County')
      setState('State')
      setCountry('Country')
    when: 'I save and submit the organization'
      clickSaveButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The organization is created and I am taken to the organization profile page'
      at new OrganizationViewPage(organizationName)
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Organization created.')
  }

  void 'Log in as an Admin and update an existing organization'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to OrganizationsPage
    and: 'I click the existing organization row from the table of organizations'
      selectCompanyByName(organizationName)
      at new OrganizationViewPage(organizationName)
    and: 'I click the "Edit" button'
      clickEditButton()
      at new OrganizationEditPage()
    and: 'I populate all required fields to create a new organization'
      sleep(5000)
      setNameField("${organizationName}Edit")
      setActionsType('An Organization not currently permitted to either Buy and Sell Low Carbon Credits.')
      setStatus('The Fuel Supplier is an active participant in the Low Carbon Credits trading market.')
      setAddressLine1('111 city edit')
      setAddressLine2('222 block edit')
      setAddressLine3('333 suite edit')
      setCity('City Edit')
      setPostalCode('B2B2B2')
      setCounty('County Edit')
      setState('State Edit')
      setCountry('Country Edit')
    when: 'I save and submit the organization'
      clickSaveButton()
    then: 'The organization is updated and I am taken to the organization profile page'
      at new OrganizationViewPage("${organizationName}Edit")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'Organization updated.')
  }
}
