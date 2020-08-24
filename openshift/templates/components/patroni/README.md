### Files included

* build.yaml build patroni image
* deployment.yaml deploy patroni 
* deployment-prereq.yaml create pre-required objects for patroni
* secret-template.yaml create template.patroni-patroni secret, it is used by pipeline

### Defore triggering pipeline

1. Create template.patroni-patroni secret
oc process -f ./secret-template.yaml | oc create -f - -n [environment namespace]

2. Build patroni image
oc process -f ./build.yaml | oc create -f - -n [tools namespace]

3. tag patrini image from tool to project
oc tag mem-tfrs-tools/patroni:v10-latest mem-tfrs-tools/patroni:v10-stable
oc tag mem-tfrs-tools/patroni:v10-stable mem-tfrs-dev/patroni:v10-stable

4. Deploy patroni
oc process -f ./deployment-prereq.yaml NAME=patroni SUFFIX=-dev PATRONI_SUPERUSER_USERNAME=postgres PATRONI_REPLICATION_USERNAME=replication | oc create -f - -n mem-tfrs-dev
oc process -f ./deployment.yaml NAME=patroni SUFFIX=-dev IMAGE_STREAM_NAMESPACE=mem-tfrs-dev PVC_SIZE=5G REPLICA=1 | oc create -f - -n mem-tfrs-dev


### Database Migration from Openshift v3 to Openshift 4

1. Openshift v4 - Update tfrs database user same as the one on Openshift v3
    For example, Openshift v3 tfrs db user name is userABC and opassword is pwpwpwpwpw
	create user "userABC" with password 'pwpwpwpwpw'; //password is same with secret
	ALTER DATABASE tfrs OWNER TO "userABC";
	DROP USER usershh;   //usershh is the old user on Openshift v4

2. Openshift v4 - Update secrets patroni-prod and template.patroni-patroni

Update app-db-username and app-db-password same as the one on Openshift v3

3. Openshift v3 - Create backup
login to patroni-backup pod and run backup.sh -1
	  created backup:  /backups/2020-08-28/postgresql-tfrs_2020-08-28_19-06-28.sql.gz

4. Move the above backup file from backup container on Openshift v3 to v4
	  for example: moved to /backups/fromv3/postgresql-tfrs_2020-08-28_19-06-28.sql.gz

5. Recover the backup to paroni database on Openshift v4
login patroini-backup pod on Openshift v4, run the following command
./backup.sh -r patroni-master-prod/tfrs -f /backups/fromv3/postgresql-tfrs_2020-08-28_19-06-28.sql.gz

6. Verify the database on Openshift v3 and v4 to make sure they are same
