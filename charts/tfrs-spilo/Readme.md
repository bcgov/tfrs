## Before running Helm
* Create secret tfrs-patroni-admin
* Create secret tfrs-patroni-app
* Create Object Storage secret for database continuous backup, tfrs-db-backup-s3 (name to tbd)

## Heml command
helm install -n 0ab226-dev -f ./values-dev.yaml tfrs-spilo .
helm uninstall -n 0ab226-dev tfrs-spilo

## Migrate Postgresql 10 on Patroni to 14 on Spilo container
* If the username contains upper case letters, should be double quoted
* create user for tfrs database, the username should be the same on v10 otherwise the restore may encounter issue
    * create user [username] with password '[password]'
* create tfrs database
    * create database tfrs owner [username] ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8'
* login to spilo pods, run the following psql to only keep 24 hours log files, otherwise they take too much space
    ALTER SYSTEM SET log_filename='postgresql-%H.log';
    ALTER SYSTEM SET log_connections='off';
    ALTER SYSTEM SET log_disconnections='off';
    ALTER SYSTEM SET log_checkpoints='off';
    select pg_reload_conf();
* Create metabase user
    CREATE USER metabaseuser WITH PASSWORD 'xxxxxx';
    GRANT CONNECT ON DATABASE zeva TO metabaseuser;
    GRANT USAGE ON SCHEMA public TO metabaseuser;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabaseuser;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabaseuser;
    verify permissions are granted:  select * from information_schema.role_table_grants where grantee='metabaseuser';
* Backup tfrs database
    pg_dump tfrs > tfrs.sql
* Restore tfrs database
    psql tfrs < ./tfrs.sql >> ./restore.log 2>&1
