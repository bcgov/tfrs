# Scenarios

## Fuel Supplier
### Scenario: Balance Update
**Given** I am a _Fuel Supplier_
And I have a starting balance of 10,000 credits
And the Director just approved a transaction which removes 10,000 credits from my account
**When** I view go to the Fuel Supply Details screen, or the Dashboard
**Then** the balance is now 0

### Scenario: View Recent Notifications on the Dashboard
**Given** I am a _Fuel Supplier_
And I have a recent unread notification
And I am on the dashboard page
**When** I click on the Notification
**Then** a modal window appears with Notification Details
And the notification flag is set to read

### Scenario: View Recent Account Activity on Dashboard
**Given** I am a _Fuel Supplier_
And I am on the dashboard page
And the respondent company accepted a transaction
**When** I view the dashboard
**Then** the transaction date is set to <now>
And the status is set to Accepted
And allowable actions are updated only View

### Scenario: View Dashboard
**Given** I am a _Fuel Supplier_
And I am on the dashboard page
And I have a credit balance of 5,000 credits
**When** I click Print on the dashboard page
**Then** the output is a printer friendly and all data is showing

### Scenario: <Create, Edit, Publish, Unpublish, Archive> Opportunity
**Given** I am a _Fuel Supplier_
And I am on the Opportunity Details screen
And the Opportunity details are (a,b,c and d)
**When** I click <action>
**Then** the Opportunity status changes to <action status>
And I go to the Opportunities screen
And the Opportinity details are (a,b,c and d)

### Scenario: Respond to Opportunity
**Given** I am a _Fuel Supplier_
And I am on the Opportunity screen
**When** I click on Accept Offer with offer details (a, b, c and d)
**Then** I see a modal popup with the opportunity details 
And I can enter a comment
And I can click Accept or Cancel 

### Scenario: Counter an Opportunity
**Given** I am a _Fuel Supplier_
And I am on the Opportunity screen
**When** I click on Counter Offer with offer details (a, b, c and d)
**Then** I go to the  credit transfer proposal screen
And the opportunity details are prepopulated
And I can enter changes to those details
And I can propose the credit transfer
And the transfer is linked to the opportunity

### Scenario: Cancel creating an Opportunity
**Given** I am a _Fuel Supplier_
And I am on the Opportunity Details screen
And there is no opportunity record for those details
**When** I Click Cancel
**Then** I go back to the Opportunities screen
And no opportunity was created
And the Opportunity is visible on the My Opportunity 

### Scenario: Manage Correspondence (fuel supplier)
**Given** I am a _Fuel Supplier_
And I am on the Fuel Supplier Details page
**When** I click add correspondence
**Then** I see a modal popup 
And I can upload an attachment, and specify <meta data: note, compliance>
And submit the correspondence attachment

### Scenario: Credit Transfer workflow options
**Given** I am a _Fuel Supplier_
And I am on the Credit Transfer screen
And the Credit Transfer status is _Accepted_
**When** I view the available actions I can take
**Then** I see the _Rescind Proposal_ button

### Scenario: Credit Transfer workflow options
**Given** I am a _Fuel Supplier_
And I am on the Credit Transfer screen
And I initiated the Credit Transfer
And the Credit Transfer status is _Proposed_
**When** I view the available actions I can take
**Then** I see the _Rescind Proposal_ button

### Scenario: Credit Transfer workflow options
**Given** I am a _Fuel Supplier_
And I am on the Credit Transfer screen
And the Credit Transfer was proposed to me
And the Credit Transfer status is _Proposed_
**When** I view the available actions I can take
**Then** I see the _Accept_ and _Reject_ buttons

## Policy Analyst
###Scenario: Award for Fuel Supply
**Given** I am a _policy analyst_
And I want to award _Esso_ _1 million_ credits
And the effective date is _on Director Approval_
**When** I submit the transaction
**Then** the transaction is logged
And transaction status is Pending
And error message is returned for bad data inputs

### Scenario: Adding Fuel Suppliers
**Given** I am a _Policy Analyst_
And I am on the Supplier List page
**When** I click add company
And a modal popup occurs that I type Exxon in
And I click search
**Then** the system returns a search result with <values: unique identifiers>
And I can select the correct company to add to the TFRS system
And I see more details about the company
And I can can confirm the addition of the company

### Scenario: View Company Details
**Given** I am a _Policy Analyst_
And I am on the Supplier List page
**When** I click on Company Name Shell
**Then** I get sent to the Company Details page for Shell
And I can manage their contacts
And I can manage their correspondence
And I can refresh the company details

### Scenario: Recommending Approval of a credit transfer
**Given** I am a _Policy Analyst_
And a credit transfer has been accepted
And I am on the dashboard (or account activity)
**When** I change a transaction status to recommended
**Then** the Government Director is notified

### Scenario: Granting User Roles
**Given** I am a _Policy Analyst_
And I am on the Fuel Supplier Details screen
**When** I click edit on a contact
**Then** I see a modal popup 
And I can set their role to Fuel Supplier or Fuel Supplier Manager
And I can update other contact details (bceid/idir, email, land line phone, sms enabled cell)
And I can click Save or Cancel

### Scenario: Manage Correspondence (government)
**Given** I am a Policy Analyst
And I am on the Fuel Supplier Details page
**When** I click add correspondence
**Then** I see a modal popup 
And I can upload an attachment, and specify <meta data: note, compliance or tags>
And submit the correspondence attachment

### Scenario: Adding credits to a new Fuel Supplier
**Given** I am a _Policy Analyst_
And I have added a new Fuel Supplier
And the fuel supplier has 0 credits
And I am on the Fuel Supplier details screen
**When** I click add credits button in the Account Balance box
**Then** I go to the create transaction screen
And the Fuel Supplier is automatically selected

### Scenario: Company History Update
**Given** I am a _Policy Analyst_
And I set or change the company status to Active
And I set the action to Buy or Sell
And I set the Fuel Supplier type to Petroleum
**When** I click save
**Then** the record is saved to the database
And the records is added to the company history

### Scenario: Credit Transfer workflow options (Accepted)
**Given** I am a _Policy Analyst_
And I am on the Credit Transfer screen
And the Credit Transfer status is _Accepted_
**When** I view the available actions I can take
**Then** I see the _Recommend for Approval_ button and the _Recommend for Rejection_ button

### Scenario: Credit Transfer workflow options (Proposed, Approved or Completed)
**Given** I am a _Policy Analyst_
And I am on the Credit Transfer screen
And the Credit Transfer status is _Proposed, Approved or Completed_
**When** I view the available actions I can take
**Then** I see no action buttons

## Fuel Supplier Manager
### Scenario: Edit Contacts/Users
**Given** I am a _Fuel Supplier Manager_
And I am on the Fuel Supplier Details screen
**When** I click edit on contact
**Then** I see a modal popup 
And I can set their role to Fuel Supplier
And I can update other contact details (bceid/idir, email, land line phone, sms enabled cell)
And I can click Save or Cancel

## Director
### Scenario: Transaction Approval
**Given** I am a _Director_
And I am on the dashboard (or account activity, or transaction details)
And the transaction status is _Accepted_ or _Recommended_
And effective date is _On Director Approval_
**When** I authorize the transaction
**Then** the transaction status is _Approved_
And the transaction approval is logged
And the effective date is set to <now>

### Scenario: Credit Transfer workflow options (Accepted)
**Given** I am a _Director_
And I am on the Credit Transfer screen
And the Credit Transfer status is _Accepted_
**When** I view the available actions I can take
**Then** I see the _Approve_ button and the _Reject_ button

### Scenario: Credit Transfer workflow options (Proposed, Approved, Completed)
**Given** I am a _Director_
And I am on the Credit Transfer screen
And the Credit Transfer status is _Proposed, Approved or Completed_
**When** I view the available actions I can take
**Then** I see no action buttons

## Other / General / Templates
### Scenario: Credit Transfer Status Changes (multiple from credit transfer details screen)
**Given** I am a <role>
And I am on the Credit Transfer screen
**When** I click the <button>
**Then** the status becomes <status>
And the transaction history is updated