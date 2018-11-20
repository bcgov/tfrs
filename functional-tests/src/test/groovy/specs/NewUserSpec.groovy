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

import spock.lang.Timeout
import spock.lang.Title
import spock.lang.Narrative
import spock.lang.Stepwise
import spock.lang.Shared

@Timeout(300)
@Stepwise
@Title('New User Tests')
@Narrative('''As a user, I want to create new users.''')
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
      setWorkPhone('1234567890')
      setMobilePhone('1234567891')
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
      setBCeIDEmail(makeUnique('newSenderEdit@fakeeemail.com'))
      setWorkPhone('9234567890')
      setMobilePhone('9234567891')
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
      setWorkPhone('3214567892')
      setMobilePhone('3214567893')
      setEmail('newReceiver@fakeeemail.com')
      setOrganization(getReceivingFuelSupplier().org)
      setStatus('Inactive')
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
      setBCeIDEmail(makeUnique('newReceiverEdit@fakeeemail.com'))
      setWorkPhone('9214567892')
      setMobilePhone('9214567893')
      setEmail('newReceiverEdit@fakeeemail.com')
      setOrganization(getReceivingFuelSupplier().org)
      setStatus('Active')
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
      setWorkPhone('3216547894')
      setMobilePhone('3216547895')
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
      setBCeIDEmail(makeUnique('newAdminEdit@fakeeemail.com'))
      setWorkPhone('9216547894')
      setMobilePhone('9216547895')
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
}
