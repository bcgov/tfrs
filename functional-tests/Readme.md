[![Releases](https://img.shields.io/github/release/bcdevops/bddstack.svg)](https://github.com/BCDevOps/BDDStack/releases/tag/1.1)

# BDDStack

## Description

This is an example of incorporating Geb into a Gradle build. It shows the use of Spock and JUnit 4 tests.

The build is setup to work with a variety of browsers and we aim to add as many as possible.
A JenkinsSlave image has been created that can run Chrome/Firefox Headless tests. This offers a viable option for replacing phantomJs in the OpenShift pipeline. Please see the [JenkinsSlave Dockerfile][dockerfile] setup.
This repository also holds a Dockerfile for a CentOS based image that will run headless tests as well.

BDDStack is 100% compatible with the tests that were created in the previous incarnation of the framework called [NavUnit][navunit] (which is now deprecated). Please see the wiki for instructions on how to use your NavUnit Tests in BDDStack.

Please see the [Wiki](https://github.com/BCDevOps/BDDStack/wiki) for more details.

## Usage

The following commands will launch the tests with the individual browsers:

    ./gradlew chromeTest
    ./gradlew chromeHeadlessTest //Will run in pipeline as well
    ./gradlew firefoxTest
    ./gradlew firefoxHeadlessTest //Will run in pipeline as well
    ./gradlew edgeTest //only on windows
    ./gradlew ieTest //Read wiki for set up instructions, only on windows
    ./gradlew safariTest //Only for MacOS, read wiki for instructions.
    
To run with all, you can run:

    ./gradlew test

Replace `./gradlew` with `gradlew.bat` in the above examples if you're on Windows.


## Source-Sets

Gradle source sets
```
sourceSets {
   test {
       groovy {
           srcDirs = [‘src/groovy’]
       }
       resources {
           srcDirs = [‘src/resources’]
       }
   }
}
```
## Questions and issues

Please ask questions on our [Slack Channel][slack_channel] and raise issues in [BDDStack issue tracker][issue_tracker].

## Useful Links:

<http://www.gebish.org/manual/current>

<http://spockframework.org/>

<http://groovy-lang.org/>

<https://inviqa.com/blog/bdd-guide>

<https://github.com/SeleniumHQ/selenium/wiki>

SourceSets: 
* <https://docs.gradle.org/current/userguide/java_plugin.html#sec:working_with_java_source_sets>
* <https://dzone.com/articles/integrating-gatling-into-a-gradle-build-understand>


[navunit]: https://github.com/bcgov/navUnit
[dockerfile]: https://github.com/BCDevOps/openshift-tools/blob/master/provisioning/jenkins-slaves/bddstack/Dockerfile
[issue_tracker]: https://github.com/rstens/BDDStack/issues
[slack_channel]: https://devopspathfinder.slack.com/messages/C7J72K1MG
