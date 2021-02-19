
## Source-to-Image (s2i) for CaddyServer 

This repo provided the bits necessary to build an OpenShift "s2i" builder image that can subsequently be used to serve web content with CaddyServer.

## Features

The main capability that this enables is *very* quick and easy publishing of static web content from GitHub repos.

## Usage

The s2i image is available in the BC Gov OpenShift instance as `bcgov-s2i-caddy`.  There is a live build configuration that can rebuild and publish the image if/as updates are required.  
 
To create a build configuration using `bcgov-s2i-caddy` that will provide an image with content from an existing GitHub repo with web content, run the following in a `-tools` project:

```
oc new-build bcgov-s2i-caddy~<path-to-your-github-repo> --name=<whatever-you-want-to-call-your-bc>
```

A concrete example:

```
oc new-build bcgov-s2i-caddy~https://github.com/bcgov/pathfinder.git
```

Note that a good practice is to capture generated BuildConfigurations and store them alongside your source code (or content) in GitHub (conventionally in an `openshift` directory in the root of the repo).  This can easily be done as follows:


```
oc new-build bcgov-s2i-caddy~<path-to-your-github-repo> --name=<whatever-you-want-to-call-your-bc> -o json  > <whatever-you-want-to-call-your-bc>-bc.json
```

You would then be able to use the generated file to create your BC, and have it on hand for future reference/updates. To use the generated file:

```
oc create -f <whatever-you-want-to-call-your-bc>-bc.json -n <your-tools-project>
```

## Running The Image

The default entrypoint script is `caddy run --conf /etc/Caddyfile`. This can be overridden. Keep in my
caddy 2.x is not compatible with caddy 1.x commands. Please check their [documentation](https://caddyserver.com/docs/getting-started) for more info.

## Requirements

You need to have access to a `-tools` project in OpenShift and have the `oc` binary locally.

## Getting Help or Reporting an Issue

Post in `#general` or `#help-me` in the BC Gov Pathfinder Slack team.

## How to Contribute

*If you are including a Code of Conduct, make sure that you have a [CODE_OF_CONDUCT.md](SAMPLE-CODE_OF_CONDUCT.md) file, and include the following text in here in the README:*
"Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms."

## License

    Copyright 2015 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at 

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
   
