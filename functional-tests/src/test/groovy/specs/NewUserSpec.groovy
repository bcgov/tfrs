package specs

import pages.CompanyDetailsPage
import pages.OrganizationsPage
import pages.OrganizationsViewPage
import pages.AddUserPage
import pages.EditUserPage
import pages.AdminUsersPage
import pages.AddAdminUserPage
import pages.ConfirmSubmitModal
import pages.UserProfilePage
import pages.ToastModal

import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise
import spock.lang.Shared

@Stepwise
@Title('New User Tests')
@Narrative('''As a user, I want to create and update users.''')
class NewUserSpec extends LoggedInSpec {

  @Shared
  String senderFirstName = makeUnique('Sender')

  @Shared
  String senderLastName = makeUnique('Lastname')

  void 'Log in as a Fuel Supplier Admin and add a new fuel supplier user'() {
    given: 'I am logged in as a Fuel Supplier Admin'
      logInAsSendingFuelSupplierAdmin()
      to CompanyDetailsPage
    and: 'I click the New User button'
      clickNewUserButton()
      at AddUserPage
    and: 'I populate all required fields to create a new user'
      setFirstName(senderFirstName)
      setLastName(senderLastName)
      setBCeIDEmail(makeUnique('newSender@fakeeemail.com'))
      setWorkPhone('2505551234')
      setMobilePhone('2505551235')
      setEmail('newSender@fakeeemail.com')
      setStatus('Active')
      checkUserRoleCheckboxByText('Credit Transfers')
      checkUserRoleCheckboxByText('Signing Authority')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is created and I am taken to the user profile page'
      at new UserProfilePage("$senderFirstName $senderLastName")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User created.')
  }

  void 'Log in as a Fuel Supplier Admin and update an existing fuel supplier user'() {
    given: 'I am logged in as a Fuel Supplier Admin'
      logInAsSendingFuelSupplierAdmin()
      to CompanyDetailsPage
    and: 'I click the existing user row from the table of users'
      clickUserRow("$senderFirstName $senderLastName")
      at new UserProfilePage("$senderFirstName $senderLastName")
    and: 'I click the Edit button'
      clickEditButton()
      at EditUserPage
    and: 'I update all fields of the existing user'
      setFirstName("${senderFirstName}Edit")
      setLastName("${senderLastName}Edit")
      setWorkPhone('6045551235')
      setMobilePhone('6045551235')
      setEmail('newSenderEdit@fakeeemail.com')
      setStatus('Inactive')
      checkUserRoleCheckboxByText('Credit Transfers')
      checkUserRoleCheckboxByText('Managing Users')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is updated and I am taken to the user profile page'
      at new UserProfilePage("${senderFirstName}Edit ${senderLastName}Edit")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User updated.')
  }

  @Shared
  String receiverFirstName = makeUnique('Receiver')

  @Shared
  String receiverLastName = makeUnique('Lastname')

  void 'Log in as an Admin and add a new fuel supplier user'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to OrganizationsPage
    and: 'I select the organization to add a new user'
      selectCompanyByText(getReceivingFuelSupplier().org)
      at new OrganizationsViewPage(getReceivingFuelSupplier().org)
    and: 'I click the New user button'
      clickNewUserButton()
      at AddUserPage
    and: 'I populate all required fields to create a new user'
      setFirstName(receiverFirstName)
      setLastName(receiverLastName)
      setBCeIDEmail(makeUnique('newReceiver@fakeeemail.com'))
      setWorkPhone('2505551236')
      setMobilePhone('2505551237')
      setEmail('newReceiver@fakeeemail.com')
      setStatus('Active')
      checkUserRoleCheckboxByText('Credit Transfers')
      checkUserRoleCheckboxByText('Signing Authority')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is created and I am taken to the user profile page'
      at new UserProfilePage("$receiverFirstName $receiverLastName")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User created.')
  }

  void 'Log in as an Admin and update an existing fuel supplier user'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to OrganizationsPage
    and: 'I select the organization to update an existing user'
      selectCompanyByText(getReceivingFuelSupplier().org)
      at new OrganizationsViewPage(getReceivingFuelSupplier().org)
    and: 'I click the existing user row from the table of users'
      clickUserRow("$receiverFirstName $receiverLastName")
      at new UserProfilePage("$receiverFirstName $receiverLastName")
    and: 'I click the Edit button'
      clickEditButton()
      at EditUserPage
    and: 'I update all fields of the existing user'
      setFirstName("${receiverFirstName}Edit")
      setLastName("${receiverLastName}Edit")
      setWorkPhone('6045551236')
      setMobilePhone('6045551237')
      setEmail('newReceiverEdit@fakeeemail.com')
      setStatus('Inactive')
      checkUserRoleCheckboxByText('Guest')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is updated and I am taken to the user profile page'
      at new UserProfilePage("${receiverFirstName}Edit ${receiverLastName}Edit")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User updated.')
  }

  @Shared
  String adminFirstName = makeUnique('Admin')

  @Shared
  String adminLastName = makeUnique('Lastname')

  void 'Log in as an Admin and add a new admin user'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to AdminUsersPage
    and: 'I click the New user button'
      clickNewUserButton()
      at AddAdminUserPage
    and: 'I populate all required fields to create a new user'
      setFirstName(adminFirstName)
      setLastName(adminLastName)
      setBCeIDEmail(makeUnique('newAdmin@fakeeemail.com'))
      setWorkPhone('2505551238')
      setMobilePhone('2505551239')
      setEmail('newAdmin@fakeeemail.com')
      setStatus('Active')
      checkUserRoleCheckboxByText('Administrator')
      checkUserRoleCheckboxByText('Government Director')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is created and I am taken to the user profile page'
      at new UserProfilePage("$adminFirstName $adminLastName")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User created.')
  }

  void 'Log in as an Admin and update an existing admin user'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to AdminUsersPage
    and: 'I click the existing user row from the table of users'
      clickUserRow("$adminFirstName $adminLastName")
      at new UserProfilePage("$adminFirstName $adminLastName")
    and: 'I click the Edit button'
      clickEditButton()
      at EditUserPage
    and: 'I update all fields of the existing user'
      setFirstName("${adminFirstName}Edit")
      setLastName("${adminLastName}Edit")
      setWorkPhone('6045551238')
      setMobilePhone('6045551239')
      setEmail('newAdminEdit@fakeeemail.com')
      setStatus('Inactive')
      checkUserRoleCheckboxByText('Government Deputy Director')
      checkUserRoleCheckboxByText('Government Director')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is created and I am taken to the user profile page'
      at new UserProfilePage("${adminFirstName}Edit ${adminLastName}Edit")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User updated.')
  }

  @Shared
  String adminFuelSupplierFirstName = makeUnique('AdminFuelSupplier')

  @Shared
  String adminFuelSupplierLastName = makeUnique('Lastname')

  void 'Log in as an Admin and add a new fuel supplier user via Administration page'() {
    given: 'I am logged in as an Admin'
      logInAsAdmin()
      to AdminUsersPage
    and: 'I click the New user button'
      clickNewFuelSupplierUserButton()
      at AddUserPage
    and: 'I populate all required fields to create a new user'
      setFirstName(adminFuelSupplierFirstName)
      setLastName(adminFuelSupplierLastName)
      setBCeIDEmail(makeUnique('newAdminFuelSupplier@fakeeemail.com'))
      setWorkPhone('2505551230')
      setMobilePhone('2505551231')
      setEmail('newAdminFuelSupplier@fakeeemail.com')
      setOrganization(getSendingFuelSupplier().org)
      setStatus('Inactive')
      checkUserRoleCheckboxByText('Managing Users')
      checkUserRoleCheckboxByText('Credit Transfers')
      checkUserRoleCheckboxByText('Guest')
    when: 'I save and submit the user'
      clickSaveUserButton()
      page(ConfirmSubmitModal)
      clickYesButton()
    then: 'The user is created and I am taken to the user profile page'
      at new UserProfilePage("$adminFuelSupplierFirstName $adminFuelSupplierLastName")
    and: 'I am shown a success toast popup'
      at new ToastModal('Success!', 'User created.')
  }
}
