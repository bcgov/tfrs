Historical Data Entry Feature
-----------------
Purpose:

To be able to add historical credit transfers into the TFRS system and have the balances computed.

Frontend:
- Mockup: Figure out from the mockup where the page will reside. If it is under `/admin/`, make your theme be `/admin_historical_data_entry`

- Create container components
- Create presentational components
  - 

Possible add-ons:
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