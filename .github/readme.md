
# TFRS Post Release Work
After the release is deployed on Prod
* Merge the tracking pull request to master
* Create the release from master amd make it as the lasted release 
* Create the new release branch from master
* Update the following fields in various files
* Create the tracking pull request to merge the new release branch to master

## Update .github/workflows/tfrs-release.yaml
* name
* branches
* PR_NUMBER
* RELEASE_NAME

## Update .pipeline/lib/config.js
* const version
* releaseBranch

## Update frontend/package.json
* version

TBV