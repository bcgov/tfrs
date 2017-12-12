-- To rename the django app from `server` to `api`, these queries should be
-- run first so that the previous migrations will not run again
UPDATE django_content_type SET "app_label" = 'api' WHERE "app_label" = 'server';
UPDATE django_migrations SET "app" = 'api' WHERE "app" = 'server';