# Introduction

So you want to build out a pull-request based pipeline. This document will guide you through the process and advise on some caviets or best practices along the way; you'll see these in the **ProTips** notes along the way.

# Setup, Build, Deployments & Your Pipeline

In this section we'll get your all the config you need into your repository and run the necessary templates in OpenShift to build out and deploy your PR based Jenkins.

We have to use a bespoke Jenkins because the one that ships with OpenShift only does branch based builds and, between you and me, its overly loaded with plugins that cause instability. 

# Setup

We need to build a bespoke Jenkins image that will pack in some custom configuration. To store all our config we recommend creating a `.jenkins` directory at the root of your project to hold your config.

Run the following commands in the root of your repository:

```console
mkdir -p .jenkins/docker/contrib/jenkins/configuration/jobs/<REPO_NAME>/
mkdir .jenkins/openshift
```

| Parameter    | Optional | Description                       |
| ------------ | -------- | --------------------------------- |
| REPO_NAME    | NO       | The case sensitive name of your repository. |

## Configuration

**OpenShift**

Copy the OpenShift templates from `sample/openshift` to the directory you created above called `.jenkins/openshift`.

**GitHub**

Jenkins needs a way to interact with GitHub. You can do it by using your own account (not recommended), creating a new account, or creating an organization account. You can read more about the different types of accounts [here](https://help.github.com/en/articles/differences-between-user-and-organization-accounts).

Once your account is created you will need the *username* and *token*. You can create a new token by going to `GitHub -> Settings -> Developer settings` and choosing `Generate new token`.

Make sure the token account has the following scope set:

| Parameter    | Optional | Description                       |
| ------------ | -------- | --------------------------------- |
| repo:status      | NO   | Access commit status. |
| public_repo      | NO   | Access public repositories. |
| write:repo_hook  | NO   | Write repository hooks. |


**Jenkins**

The next step is to modify a jenkins config file some info from GitHub. Copy the sample Jenkins `sample/config.xml` from this directory to the directory you created above called `.jenkins/docker/contrib/jenkins/configuration/jobs/<REPO_NAME>/`

Next, edit this file and find the following lines:

```xml
<id>A_UUID_GOES_HERE</id>
<credentialsId>github-account</credentialsId>
<repoOwner>GITHUB_USERNAME</repoOwner>
<repository>REPOSITORY_NAME</repository>
```

| Parameter         | Optional | Description                       |
| ----------------- | -------- | --------------------------------- |
| A_UUID_GOES_HERE  | NO       | A UUID (See ProTip). |
| GITHUB_USERNAME   | NO       | The GitHub user ID from above. |
| REPOSITORY_NAME   | NO       | The name of the repository, matching case **without** the `.git` extension. |

Go ahead and commit your `.jenkins` directory and all of the files and directories inside it.

### ProTip

* This is what a UUID should look like: b358bd09-d6b8-4836-ac58-c32f6b356c3e 
* You can use [this](https://www.uuidgenerator.net/) site to generate an UUID.

## Build

Now we're going to mint a bespoke Jenkins image using the built in OpenShift mechanics. Its going to use a Dockerfile to do this; copy file `sample/Dockerfile` to `.jenkins/docker` in your repo then commit and push these changes. The Dockerfile needs to be in your repo so the OpenShift build can use it.

Run the following command to trigger an OpenShift image build:

```console
oc process -f .jenkins/openshift/build.yaml \
SOURCE_REPOSITORY_URL=https://github.com/bcgov/blarb.git \
SOURCE_REPOSITORY_REF=master \
| oc create -f -
```

| Parameter              | Optional | Description                       |
| ---------------------- | -------- | --------------------------------- |
| SOURCE_REPOSITORY_URL  | NO       | The full URL of your repository. |
| SOURCE_REPOSITORY_REF  | NO       | The main branch. In needs to contain the `.jenkins` directory you just committed. |


### ProTip

* Add the label flag `-l "app=jenkins-basic-bc"` to the `oc process` command so that all the objects created by this template share a common label and can be easily identified or deleted. The `bc` at the end is meant to distinguish build-config objects from deploy-config objects.


## Deploy

We will use and OpenShift template to crate two secrets: The first will contains GitHub credentisla so that Jenkins can interact with GitHub. The second is the Jenkins credentials the builder nodes will use to contact the master node.

```
oc process -f .jenkins/openshift/secret.yaml \
GITHUB_USERNAME=foouser \
GITHUB_PASSWORD=6dc7f2532350ca20e86b05 \
| oc create -f -
 ```

| Parameter        | Optional | Description                       |
| ---------------- | -------- | --------------------------------- |
| GITHUB_USERNAME  | NO       | The GitHub account you created earlier in the process. |
| GITHUB_PASSWORD  | NO       | The access token you created earlier in the process. |


Next, we need to deploy the newly minted Jenkins image. This will create two Jenkins nodes: A `master` node that will serve to orchestrate your builder images and a single builder image to do all the heavy lifting. It will also create two Webhooks in your repository: One will will be used to send pull-request notifications and the other to invoke a build on the given pull-request.

```console
oc process -f .jenkins/openshift/deploy.yaml \
NAME=jenkins \
ROUTE_HOST=jenkins-devex-mpf-secure-tools.pathfinder.gov.bc.ca \
| oc create -f -
```

| Parameter   | Optional | Description                       |
| ----------- | -------- | --------------------------------- |
| NAME        | NO       | The name used for the node deployments. |
| ROUTE_HOST  | NO       | The route used to access Jenkins. |

When this command finishes you'll see two deployments start, one for each node mentioned above. They deployments will start two pods, again, representing the two nodes mentioned above.

### ProTip

* Add the label flag `-l 'app=jenkins-basic-dc'"` to the `oc process` command(s) so that all the objects created by this template share a common label and can be easily identified or deleted. The `bc` at the end is meant to distinguish build-config objects from deploy-config objects.

## Pipeline

The final step is to create a `Jenkinsfile` that will be used by Jenkins to do your build. This project has one that echos `Hello World`. Start with it so that you can be sure all the plumbing is working before you start customizing.

Copy the `sample/Jenkinsfile` to the root of your repository. Make sure its on the `master` branch or wherever you fork from when creating a new pull-request. It must be present in any PR you wish to build.

## Testing

Create a pull request. You should be able to 

