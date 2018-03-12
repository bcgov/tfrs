# Authentication
This project has implemented authentication via SiteMinder/BCeID. The entire application is protected by SiteMinder. It uses the headers sent by SiteMinder to authenticate a user.

*Front-end authentication* Send a request to `api/users/current` to get the current authenticated user. If a user is unauthorized, it gets a `401 Unauthorized` response.

*API authentication* Makes use of Django's custom authentication. It checks for SiteMinder headers to match the user in the database. The first time a user logs in, their `authorization_guid` is empty, so it does a lookup for users with a matching `authorization_id` (whose `authorization_guid` is empty). Once they've logged in, their unique SiteMinder GUID is saved into `authorization_guid` and we authenticate using that field. It is our assumption that the `authorization_guid` is truly unique (where as the `authorization_id` or SiteMinder user id/username is re-useable and non-unique).

## Bypassing Authentication
You may find it useful to bypass authentication. To allow the API to enable this, set the environment variable `BYPASS_HEADER_AUTHENTICATION` to True.

**If you're only working on the front-end**, you might find it easer to simply use http://api-bypass-mem-tfrs-dev.pathfinder.gov.bc.ca/api for the api's `BASE_URL` in `Routes.js`.


## Local setup with header authentication

You may go down this route if you're working on both the api and the front-end client

The easiest way to have it up and running locally is to setup a web proxy (nginx or apache) in your local machine that has the path `/` pointing to the front-end server and `/api` pointing to the api server.

This project requires authentication via SiteMinder headers. You would need to configure your web proxy to set specific headers:

*Internal/Gov user*
```
proxy_set_header Host                  $host;
proxy_set_header X-Forwarded-For       $remote_addr;
proxy_set_header Sm-UniversalId        "YOUR_USERNAME";
proxy_set_header Smgov-Userguid        "VALID_GUID";
proxy_set_header Sm-Authdirname        "IDIR";
proxy_set_header Smgov-USERTYPE        "Internal";
proxy_set_header Smgov-Useremail       "YOUR_EMAIL";
proxy_set_header Smgov-UserDisplayName "LAST_NAME, FIRST_NAME MINISTRY:EX";
```

*External/Business user*
```
proxy_set_header Host                     $host;
proxy_set_header X-Forwarded-For          $remote_addr;
proxy_set_header Sm-UniversalId           "YOUR_USERNAME";
proxy_set_header Smgov-Userguid           "VALID_GUID";
proxy_set_header Smgov-BusinessLegalName  "BUSINESS_NAME";
proxy_set_header Smauth-Businesslegalname "BUSINESS_NAME";
proxy_set_header Smgov-Businessguid       "VALID_GUID";
proxy_set_header Smgov-Useremail          "YOUR_EMAIL";
proxy_set_header Smgov-UserDisplayName    "FIRST_NAME LAST_NAME";
```

It then checks this header against the  `authorization_id` field on `user` table in the database.
