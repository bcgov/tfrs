# Authentication
This project has implemented authentication via SiteMinder/BCeID. The entire application is protected by SiteMinder. It uses the headers sent by SiteMinder to authenticate a user.

*Front-end authentication* Send a request to `api/users/current` to get the current authenticated user. If a user is unauthorized, it  shows an Unauthorized error page.

*API authentication* Makes use of Django's custom authentication. It checks for SiteMinder headers to match the user in the database. The first time a user logs in, their `authorization_guid` is empty, so it does a lookup for users with a matching `authorization_id` (whose `authorization_guid` is empty). Once they've logged in, their unique SiteMinder GUID is saved into `authorization_guid` and we authenticate using that field. It is our assumption that the `authorization_guid` is truly unique (where as the `authorization_id` or siteminder user id/username is re-useable and non-unique).

**If you're working on both the api and the front-end client:**

The easiest way to have it up and running is to setup a web proxy (nginx or apache) in your local machine that has the path `/` pointing to the front-end server and `/api` pointing to the api server.

This project requires authentication via Siteminder headers. You would need to configure your webproxy to set specific headers:
```
proxy_set_header Host            $host;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header Sm-UniversalId  "YOUR_USERNAME";
proxy_set_header Smgov-Userguid  "b5762a7b-87ba-46d0-b050-f4459124f60a";
```
It then checks this header against the  `authorization_id` field on `user` table in the database.

**If you're just working on one part of the stack (either backend or front-end)**

You may find it useful to bypass authentication. This happens automatically if you set the environment variable `DJANGO_DEBUG` to `true`.
Note that if you want to **not** bypass authentication, you need to setup a web proxy and set the host header to a hostname other than `localhost`.
