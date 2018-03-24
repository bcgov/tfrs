Historical Data Entry Feature
--------------------------

**Status:** *(in progress)*

PURPOSE:

To be able to add historical credit transfers into the TFRS system and have the balances computed.

TASKS:

------------
Frontend:
- Mockup: Figure out from the mockup where the page will reside navigation-wise. If it is under `/admin/`, make your theme be `/admin/historical_data_entry`
- Create a folder for your theme under `./src/`. So it will be `./src/admin/historical_data_entry/`
- Create container components under `./src/admin/historical_data_entry/`
  - Components for processing the CRUD
    - Learn & reuse redux actions and reducers for the API calls
    - Modify as needed
- Create presentational components under `./src/admin/historical_data_entry/components/`
  - A component for the 'add historical data form'
  - A component for the 'edit historical data form' (see if the add component can be reused)
  - A component for listing the historical data
  - A parent component for the admin historical data page (also known as the index page)
- Adding historical credit transfers
  - The trade effective date should be set by the user & sent to the API.
  - The status of an added credit transfer should be "Approved"
- Editing historical credit transfers
  - Status can't be changed
- Deleting historical credit transfers
  - A deleted credit transfer should never be processed
- A button to process all the credit transfers on the historical data entry page
-----------
API:
- Create an end point to process the created credit transfers (all of which should be in 'approved' status). Could be `/api/credit_transfers/batch_process`
  - Finds all credit transfers that are in 'approved' status and created by the government, ordered by trade effective date.
  - Process the credit transfer with the oldest trade effective date
  - Transfer credits from one organization to the other, depending on the transaction type. \**Note: Government doesn't actually have a real balance, so the balance is an arbitrary high number. Possibly look into not caring about the government's balance when doing government-related transfers*
    - Sell: Transfer credits from one fuel supplier (org) to the other fuel supplier (org)
    - Validation: Transfer credits from the government (org) to the fuel supplier (org)
    - Retirement: Transfer credits from the fuel supplier (org) to the government (org)
    - Part 3 Award: Transfer credits from the government (org) to the fuel supplier (org)
  - Change status to 'Completed'
- Create the unit tests
----
Possible add-ons (discuss in next sprint planning):
- Add a feature flag setting to enable this.
   - Add a `settings` endpoint to the *API* to have a list of features that can be turned on an off
   - Read from the `/api/settings` endpoint if the setting for `admin_historical_data_entry` is set to True.
   - Possible setting json structures for `/api/settings/`:
     ```json
     features: {
       admin: {
         historical_data_entry: True
       }
     }

     // or...

     features: {
       admin_historical_data_entry: True
     }
     ```
