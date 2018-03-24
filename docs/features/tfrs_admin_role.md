TFRS Admin Role
-----

**Status:** *(most are not yet implemented)*

Before implementing the Roles & Permissions fully, it may be wise to implement the TFRS Admin functionality to allow TFRS developers and admin to log into the website & provide the following abilities:

- Create/Edit/Delete an organization
- Create/Edit/Delete a user under an organization

**Users, username, and SiteMinder Authentication**

When creating a user, require their `authorization_id`. This is the username which is the same as their IDIR or BCeID username. The system uses this to get their guid & find a match in the database. If a user attempts to login to TFRS but has no matching `authorization_id` they will be unable to login.

**Django Admin**

Django provides an admin interface for managing your application(s). The app currently has this implemented, but it only works for local installations for now. The url is accessible through `/api/api_admin`. I don't think this works in the deployed applications though, so it may be useful to look into enabling this for deployed applications (if it's easier to configure this vs creating a custom UI code to provide the CRUD for the admin interface).
