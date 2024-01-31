
# Production release

## Pre-production release

* Update the description of the tracking pull request
* Verify the changes made during the previous post production release

## Production release

* Manually trigger the pipeline tfrs-release.yaml

## Post production release

* Merge the tracking pull request to master
* Create the release tag from master amd make it as the lasted release (this is done automatically by pipeline create-release.yaml)
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
* Commit all the above changes and create the tracking pull request to merge the new release branch to master. Need to update the PR_NUMBER after the tracking pull request is created. 

# TFRS Pipelines

## Primary Pipelines

* dev-release.yaml (TFRS Dev release-2.10.0): the pipeline is automatically triggered when there is a commit to the release branch
* tfrs-release.yaml (TFRS release-2.10.0): the pipeline builds the release and deploys on Test and Prod, it needs to be manually triggered
* create-release.yaml (Create Release after merging to master): tag and create the release after merging release branch to master. The description of the tracking pull request becomes release notes

## Other Pipelines

* cleanup-cron-workflow-runs.yaml (Scheduled cleanup old workflow runs): a cron job to cleanup the old workflows
* cleanup-workflow-runs.yaml  (Cleanup old workflow runs): manually cleanup teh workflow runs

