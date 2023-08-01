
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

* dev-release.yaml (TFRS Dev release-2.9.0): the pipeline is automatically triggered when there is a commit to the release branch
* tfrs-release.yaml (TFRS release-2.9.0): the pipelin builds the release and deploy on Test and Prod, it needs to be manually triggered
* create-release.yaml (Create Release after merging to main): tag and create the release after merging release branch to main. The description of the tracking pull request becomes release notes

## Other Pipelines

* cleanup-cron-workflow-runs.yaml (Scheduled cleanup old workflow runs): a cron job to cleanup the old workflows
* cleanup-workflow-runs.yaml  (Cleanup old workflow runs): manually cleanup teh workflow runs

