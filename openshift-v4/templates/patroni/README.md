### Files included

* build.yaml build patroni image
* deployment.yaml deploy patroni 
* deployment-prereq.yaml create pre-required objects for patroni
* secret-template.yaml create template.patroni-patroni secret, it is used by pipeline

### Before triggering pipeline

1. Create template.patroni-patroni secret, make sure the secretes are same as Openshift V3
oc process -f ./secret-template.yaml | oc create -f - -n [environment namespace]	
Note, when patroni is deployed, the username will be changed to all lowercase, read next section for details for Openshift v4 Migration

2. Build patroni image
oc process -f ./build.yaml | oc create -f - -n [tools namespace]

3. tag the patroni image to environment
oc tag [tools namspace]/patroni:v10-latest [env namspace]/patroni:v10-stable

### Database Migration from Openshift v3 to Openshift 4

1. On Openshift V4, update the secrets in template.patroni-patroni same a Openshift V3

2. 	For example, Openshift v3 tfrs db user name is userABC and password is pwpwpwpwpw
	create user "userABC" with password 'pwpwpwpwpw'; //password is same with secret
	ALTER DATABASE tfrs OWNER TO "userABC";
	DROP USER userabc;   //userabc is the old user on Openshift v4

3. Openshift v3 - Create backup
login to patroni-backup pod and run backup.sh -1
	  created backup:  /backups/2020-08-28/postgresql-zeva_2020-08-28_19-06-28.sql.gz

4. Move the above backup file from backup container on Openshift v3 to v4
	  for example: moved to /backups/fromv3/postgresql-zeva_2020-08-28_19-06-28.sql.gz

5. Recover the backup to paroni database on Openshift v4
login patroni-backup pod on Openshift v4, run the following command
./backup.sh -r patroni-master-prod/tfrs -f /backups/fromv3
Notes, yes, folder name only

6. Verify the database on Openshift v3 and v4 to make sure they are same

### Create staging patroni in order to test the operational scripts

1. backup prod database and rsync to test env ex. /backups/2020-10-30-prod/patroni-master-prod-tfrs_2020-10-30_12-29-48.sql.gz

2. create patroni-staging statefulset
	oc process -f ./deployment-prereq.yaml SUFFIX=-staging ... //make sure the user passwors are same as prod
	oc process -f ./deployment.yaml \
	NAME=patroni \
	ENV_NAME=test \
	SUFFIX=-staging \
	CPU_REQUEST=200m \
	CPU_LIMIT=400m \
	MEMORY_REQUEST=250M \
	MEMORY_LIMIT=500M \
	IMAGE_REGISTRY=docker-registry.default.svc:5000 \
	IMAGE_STREAM_NAMESPACE=mem-tfrs-test \
	IMAGE_STREAM_TAG=patroni:v10-stable \
	REPLICA=1 \
	PVC_SIZE=1G \
	STORAGE_CLASS=netapp-block-standard \
	| oc create -f - -n mem-tfrs-test

3. restore - on Dev

login to patroni-master-staging pod:
    create user "userUQL" with password ''; //password to find in patroni-staging secret
    ALTER DATABASE tfrs OWNER TO "userUQL";
    DROP USER useruql; 
				
on backup pod in test env:
./backup.sh -r patroni-master-dev-1713:5432/tfrs -f /backups/patroni-backup/forRecovery/
the admin command can get from the patroni-staging secret

4. update bacckend dc to connect to staging database

