Controls
-----

**Status:** *(mostly implemented)*

"Controls" are Organization-based controls which determine which actions are available to the logged-in user depending on the credit transfer's status.

## Statuses
1. **Draft** - A credit transfer that isn't complete
2. **Submitted (or Proposed)** - A credit transfer that is ready to be viewed by the other party
3. **Accepted** - A credit transfer that has been agreed upon by two parties
4. **Recommended (for Decision)** - A government status meant to inform the director of the notes, research and recommendations for the transaction
5. ~~Not Recommended~~ - *(not in use anymore)*
6. **Approved** - A government director has approved & finalized the transaction
7. **Completed** - A status used by the application when the credit balances have been updated/transferred from one organization to the other.
8. **Cancelled (Rescinded or Refused)** - When either party has cancelled the transaction (see actions table below)
9. **Declined** - A government director has declined the transfer and no further actions are needed



## Visibility
*FS = Fuel Supplier*

Who can view what?

**Fuel Suppliers**

|Status|Initiator (FS)|Respondent (FS)|Government|
|---|---|---|---|
|Draft|Y|N|N|
|Proposed|Y|Y|N|
|Accepted|Y|Y|Y|

**Government**

|Status|Initiator (FS)|Respondent (FS)|Government|
|---|---|---|---|
|Recommended for Decision*|*|*|Y|
|Approved|Y|Y|Y|
|Declined|Y|Y|Y|

If a status is in `Recommended for Decision`, it appears as `Accepted` for the Fuel Suppliers' UI.

## Actions
Here are the buttons that should show up for the actions available to an organization depending on the status of the transfer.

|Status|Initiator (FS)|Respondent (FS)|Government|
|---|---|---|---|
|Draft|Delete, Propose, Save as Draft|N/A|N/A|
|Proposed|Rescind|Refuse, Accept|N/A|
|Accepted|Rescind|Rescind|Recommend for Decision, Approve|
|Rescinded|N/A|N/A|N/A|
|Recommended for Decision|N/A|N/A|Approve, Decline|
|Approved|N/A|N/A|N/A|
|Declined|N/A|N/A|N/A|

## Status Workflow
|Flow|Controls|Actions|Permissions|
|---|---|---|---|
|New to Draft|N/A|Create Draft (Propose Trade and Save as Draft|Initiator-only|
|New to Proposed|N/A|Create & Propose (Propose Trade and Propose)|Initiatory-only|
|Draft to Proposed|N/A|Update fields, change status from `draft` to `submitted`|Initiator-only|
|Proposed to Accepted|Limited to a respondent; Can't edit fields (read-only); Can add a note; Previous status must be `proposed` |Change status to `accepted`|Initiator & Respondent|
|Proposed to Rescinded|Can only be done by the initiator; Can add a note; Previous status must be `proposed`; Very similar to `refused`, only difference is the label changes depending on who's viewing it|Change status to `cancelled` (`rescinded`)|Initiator-only|
|Proposed to Refused|Can only be done by the respondent;Can add a note; Previous status must be `proposed`; Very similar to `rescinded`, only difference is the label changes depending on who's viewing it|Change status to `cancelled` (`rescinded`)|Respondent-only|
|Proposed to Accepted|Can only be done by the respondent; Can add a note|Change status to `accepted`|Respondent-only|
|Accepted to Rescinded|Can be done by both the initiator & respondent; Can add a note; Very similar to `refused` and `rescinded`, only difference is this happens after they've both agreed on a transfer and the government can already see the transfer at this stage|Change status to `cancelled`|Initiator & Respondent|
|Accepted to Recommended for Decision|Can only be done by a government user; Must add a note|Change status to `recommended`|Government only|
|Recommended for Decision to Rescinded|When the status is in `recommended`, the director has not approved the transfer yet. The Fuel Suppliers can only see the status as `Accepted` on their UI and therefore can still cancel it|Change status to `Cancelled`| Initiator & Respondent only|
|Accepted to Approved|**see Recommended for Decision to Approved|N/A|N/A|
|Accepted to Decline|**see Recommended for Decision to Declined|N/A|N/A|
|Recommended for Decision to Approved|Can only be done by a government director|Change status to `approved`; Transfer and update balances; Change status to `completed`|Government-only|
|Recommended for Decision to Declined|Can only be done by a government director|Change status to `declined`|Government-only|



## Special controls & labels
|Case|Reason|Label on UI|
|---|---|---|
|Proposed to Refused|Cancelled by a respondent|Refused|
|Proposed to Rescinded|Cancelled by the initiator|Rescinded|
|Accepted to Rescinded|Cancelled by any party after both have accepted|Rescinded|


**Note: if a credit transfer has been `accepted` at any point, it should still show up in the government's list view of credit transfers. This applies to transfers that have been `accepted` and then later on `cancelled` (Rescinded).
