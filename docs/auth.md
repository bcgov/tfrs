# Authentication
This project has implemented authentication via SiteMinder/BCeID. The entire application is protected by SiteMinder. It uses the headers sent by SiteMinder to authenticate a user.

*Front-end authentication* Send a request to `api/users/current` to get the current authenticated user. If a user is unauthorized, it  shows an Unauthorized error page.

*API authentication* Makes use of Django's custom authentication. It checks for SiteMinder headers to match the user in the database. The first time a user logs in, their `authorization_guid` is empty, so it does a lookup for users with a matching `authorization_id` (whose `authorization_guid` is empty). Once they've logged in, their unique SiteMinder GUID is saved into `authorization_guid` and we authenticate using that field. It is our assumption that the `authorization_guid` is truly unique (where as the `authorization_id` or siteminder user id/username is re-useable and non-unique).
