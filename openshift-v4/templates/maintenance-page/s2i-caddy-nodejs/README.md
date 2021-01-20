# TL;DR

This repo has all the ingredients to make a Caddy s2i builder image.
Once built, the image can be used to simplify the build process of content that needs to be served up via Caddy such as projects based on React, Angular, or Gatsby.

# Usage

The easiest way to consume this image is to find it in Artifactory and reference it in the `sourceStrategy` section of your build config.

```yaml
  strategy:
        sourceStrategy:
          env:
          - name: BUILD_LOGLEVEL
            value: "5"
          from:
            kind: ImageStreamTag
            name: caddy-s2i-builder:latest
            namespace: bla
          incremental: false
        type: Source
```

If you can't find it, or don't have access to it, you can build your own copy in your `tools` namespace with the steps below:

First, create your own build config using the template in this repo:

```console
oc process -f https://raw.githubusercontent.com/bcgov/s2i-caddy-nodejs/master/openshift/templates/build.yaml | \
oc apply -f -
```

The OCP `builder` will need to pull a base image from the RedHat Container Registry; you'll see it as the first line in the [Dockerfile](./Dockerfile):

```console
FROM registry.redhat.io/rhel8/nodejs-12:latest
```

To let your `builder` do this, sign-up for a *free* RedHat Developer to [this site](https://catalog.redhat.com/software/containers/search). Once you have credentials, [create a secret](https://docs.openshift.com/container-platform/3.11/dev_guide/managing_images.html#allowing-pods-to-reference-images-from-other-secured-registries) the builder can use to pull image from the catalog:

```console
oc create secret docker-registry rh-registry \
--docker-server=registry.redhat.io \
--docker-username=<USERNAME> \
--docker-password=<PASSWORD> \
--docker-email=unused
```

[Link the secret](https://docs.openshift.com/container-platform/3.11/dev_guide/managing_images.html#allowing-pods-to-reference-images-from-other-secured-registries) so the `builder` can use it; this command assumes your went with the default config name `caddy-s2i-builder` and the default secret name `rh-registry`. If you changed these, adjust the command below.

```console
oc set build-secret --pull bc/caddy-s2i-builder rh-registry
```

The final step is to trigger the build which will make the s2i caddy image and store a copy in your namespace:

```console
oc start-build bc/caddy-s2i-builder --follow
```

Reference this newly minted image in your `sourceStrategy` of your project yaml as you would any other source image.

# Creating a basic S2I builder image  

This section is usefully if you want to customize this image.

## Getting started  

### Files and Directories  
| File                   | Required? | Description                                                  |
|------------------------|-----------|--------------------------------------------------------------|
| Dockerfile             | Yes       | Defines the base builder image                               |
| s2i/bin/assemble       | Yes       | Script that builds the application                           |
| s2i/bin/usage          | No        | Script that prints the usage of the builder                  |
| s2i/bin/run            | Yes       | Script that runs the application                             |
| s2i/bin/save-artifacts | No        | Script for incremental builds that saves the built artifacts |
| test/run               | No        | Test script for the builder image                            |
| test/test-app          | Yes       | Test application source code                                 |

#### Dockerfile
Create a *Dockerfile* that installs all of the necessary tools and libraries that are needed to build and run our application.  This file will also handle copying the s2i scripts into the created image.

#### S2I scripts

##### assemble
Create an *assemble* script that will build our application, e.g.:
- build python modules
- bundle install ruby gems
- setup application specific configuration

The script can also specify a way to restore any saved artifacts from the previous image.   

##### run
Create a *run* script that will start the application. 

##### save-artifacts (optional)
Create a *save-artifacts* script which allows a new build to reuse content from a previous version of the application image.

##### usage (optional) 
Create a *usage* script that will print out instructions on how to use the image.

##### Make the scripts executable 
Make sure that all of the scripts are executable by running *chmod +x s2i/bin/**

#### Create the builder image
The following command will create a builder image named blarb based on the Dockerfile that was created previously.
```
docker build -t blarb .
```
The builder image can also be created by using the *make* command since a *Makefile* is included.

Once the image has finished building, the command *s2i usage blarb* will print out the help info that was defined in the *usage* script.

#### Testing the builder image
The builder image can be tested using the following commands:
```
docker build -t blarb-candidate .
IMAGE_NAME=blarb-candidate test/run
```
The builder image can also be tested by using the *make test* command since a *Makefile* is included.

#### Creating the application image
The application image combines the builder image with your applications source code, which is served using whatever application is installed via the *Dockerfile*, compiled using the *assemble* script, and run using the *run* script.
The following command will create the application image:
```
s2i build test/test-app blarb blarb-app
---> Building and installing application from source...
```
Using the logic defined in the *assemble* script, s2i will now create an application image using the builder image as a base and including the source code from the test/test-app directory. 

#### Running the application image
Running the application image is as simple as invoking the docker run command:
```
docker run -d -p 8080:8080 blarb-app
```
The application, which consists of a simple static web page, should now be accessible at  [http://localhost:8080](http://localhost:8080).

#### Using the saved artifacts script
Rebuilding the application using the saved artifacts can be accomplished using the following command:
```
s2i build --incremental=true test/test-app nginx-centos7 nginx-app
---> Restoring build artifacts...
---> Building and installing application from source...
```
This will run the *save-artifacts* script which includes the custom code to backup the currently running application source, rebuild the application image, and then re-deploy the previously saved source using the *assemble* script.
