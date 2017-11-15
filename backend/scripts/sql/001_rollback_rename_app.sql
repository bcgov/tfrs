--- Rollback the rename
UPDATE django_content_type SET "app_label" = 'server' WHERE "app_label" = 'api';
UPDATE django_migrations SET "app" = 'server' WHERE "app" = 'api';