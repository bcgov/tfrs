## Create tracking PR
* Create release branch from master and make it as the default branch
* Create a Tracking PR to bring the release branch to master
* All other PRs target the release PR
* Only deploy the Tracking PR to Dev, test and Prod, not any other single PR

## Build tracking PR
* Update .pipeline/config.js releaseBranch to be the release branch
* Under .pipeline,  npm run build -- --pr= --env=build

## Deploy tracking PR

### deploy database for the PR on Dev
* Create knps for the PR
npm run deploy-knps -- --pr= --env=dev
* Deploy the patroni
npm run deploy-db -- --pr= --env=dev
* Update user and restore the backup to database
Refer to the last section of openshift-v4/templates/patroni/README.md, remember to verify the Dev database user
* Add tfrs user and /tfrs vhost to rabbitmq
Refer to the last section of penshift-v4/templates/rabbitmq
* Deploy PR 
npm run deploy -- --pr= --env=dev

### deploy database for the PR on Test or Prod
* Only need to deploy compiled components, nothing else as all others are already there
npm run deploy -- --pr= --env=test
npm run deploy -- --pr= --env=prod

