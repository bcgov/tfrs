# TFRS Post Release Work
After the release is deployed on Prod:
* Merge the tracking pull request to master
* Create the release tag from master amd make it as the lasted release 
* Create the new release branch from master
* Update tfrs-release.yaml
  * name
  * branches
  * PR_NUMBER
  * RELEASE_NAME
* Update .pipeline/lib/config.js
  * const version
  * releaseBranch
* Update frontend/package.json
  * version
* update dev-release.yaml
  * name
  * branches
  * PR_NUMBER
  * RELEASE_NAME
* Commit all teh above changes and create the tracking pull request to merge the new release branch to master

# TFRS Pipelines

## Primary Pipelines

* dev-jan-release.yaml (TFRS Dev Jan Release): the pipeline build Jan 2024 release and deploy on dev for every commit
* dev-release.yaml (TFRS Dev release-2.9.0): the pipeline is automatically triggered when there is a commit to the release branch
* tfrs-release.yaml (TFRS release-2.9.0): the pipelin builds the release and deploy on Test and Prod, it needs to be manually triggered

## Other Pipelines

* branch-deploy-template.yaml (Branch Deploy Template): a pipeline template to deploy a branch
* build-template.yaml (Build Template): a pipeline template to build branch or pull request
* cleanup-cron-workflow-runs.yaml (Scheduled cleanup old workflow runs): a cron job to cleanup the old workflows
* cleanup-workflow-runs.yaml  (Cleanup old workflow runs): manually cleanup teh workflow runs
* pr-dev-cicd.yaml (TFRS Dev Jan PR CICD): the pipeline builds Jan 2024 pull requests and deploy on dev if the pull request title ends with build-on-dev
* pr-dev-database-template.yaml (PR Dev Database Template): the template to create database for pull request build
* pr-deploy-template (PR Dev Deploy Template): the template deploys pull request build to dev
* pr-teardown.yaml (TFRS Dev Jan PR Teardown): tear down the Jan 2024 pull request builds from dev
