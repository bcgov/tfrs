[![Releases](https://img.shields.io/github/release/bcdevops/bddstack.svg)](https://github.com/BCDevOps/BDDStack/releases/tag/1.1)

# Description (From [BDDStack Repo](https://github.com/BCDevOps/BDDStack/))

This is an example of incorporating Geb into a Gradle build. It shows the use of Spock and JUnit 4 tests.

The build is setup to work with a variety of browsers and we aim to add as many as possible.
A JenkinsSlave image has been created that can run Chrome/Firefox Headless tests. This offers a viable option for replacing phantomJs in the OpenShift pipeline. Please see the [JenkinsSlave Dockerfile][dockerfile] setup.
This repository also holds a Dockerfile for a CentOS based image that will run headless tests as well.

BDDStack is 100% compatible with the tests that were created in the previous incarnation of the framework called [NavUnit][navunit] (which is now deprecated). Please see the wiki for instructions on how to use your NavUnit Tests in BDDStack.

Please see the [Wiki](https://github.com/BCDevOps/BDDStack/wiki) for more details.

[navunit]: https://github.com/bcgov/navUnit
[dockerfile]: https://github.com/BCDevOps/openshift-tools/blob/master/provisioning/jenkins-slaves/bddstack/Dockerfile
[issue_tracker]: https://github.com/rstens/BDDStack/issues
[slack_channel]: https://devopspathfinder.slack.com/messages/C7J72K1MG

# Usage

The following commands will launch the tests with the individual browser:
```
./gradlew chromeTest
./gradlew chromeHeadlessTest // Will run in OpenShift

./gradlew firefoxTest
./gradlew firefoxHeadlessTest // Will run in OpenShift
```

The following are experimental and may need additional work/configuration to make work:
```
./gradlew edgeTest // Only on Windows
./gradlew ieTest // Only on Windows, read wiki for set up instructions
./gradlew safariTest // Only on MacOS, read wiki for set up instructions
```

# Geb - Key Concepts

  Geb Manual: http://www.gebish.org/manual/current
  Geb API Doc: http://www.gebish.org/manual/current/api/

  All of the documentation is useful and will need to be referenced eventually, however, certain key sections are listed below to jump start learning:

  Pages:
    - http://www.gebish.org/manual/current/#pages

    Notable sections:
      http://www.gebish.org/manual/current/#the-page-object-pattern-2
      http://www.gebish.org/manual/current/#template-options
      http://www.gebish.org/manual/current/#at-checker

  Modules:
    - http://www.gebish.org/manual/current/#modules
    Modules aren't ever strictly required, but are useful for modularizing pieces of a page definition that might span multiple pages.  IE: the common page header and footer.

  Navigators:
    - http://www.gebish.org/manual/current/#the-jquery-ish-navigator-api
    - http://www.gebish.org/manual/current/#navigator

    Notable sections:
      http://www.gebish.org/manual/current/#the-code-code-function
      http://www.gebish.org/manual/current/#finding-filtering
      http://www.gebish.org/manual/current/#interact-closures

  Waiting:
    - http://www.gebish.org/manual/current/#implicit-assertions-waiting

    Waitng Config:
    - http://www.gebish.org/manual/current/#waiting-configuration
    - http://www.gebish.org/manual/current/#at-check-waiting

  At Checking:
    - http://www.gebish.org/manual/current/#at-checking

  Debugging:
    - http://www.gebish.org/manual/current/#pausing-and-debugging


# Other Useful Links

Spock: <http://spockframework.org/>

Groovy: <http://groovy-lang.org/>

Selenium: <https://github.com/SeleniumHQ/selenium/wiki>

What is BDD: <https://inviqa.com/blog/bdd-guide>

SourceSets:
* <https://docs.gradle.org/current/userguide/java_plugin.html#sec:working_with_java_source_sets>
* <https://dzone.com/articles/integrating-gatling-into-a-gradle-build-understand>
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

# Troubleshooting Guide
## Groovy
### Getters and Setters

  > Groovy has built in getter/setter support.  Meaning if a class variable `String dog` exists, then `setDog()` and `getDog()` are automatically present by default.  The unexpected sid effect of this, is that if you create your own `setDog()` method, it will not be called, as groovy has already reserved that method itself.

#### Example

In the below code snippet, calling `setInputField()` from your spec will NOT call the `setInputField()` method in the snippet.  Instead, it will call the auto-magically created `setInputField()` setter created by Groovy by default.

```
class MyPage extends page {
  static content = {
    nameField { $('#inputField') }
  }

  setNameField(String someValue) {
    inputField.value(someValue)
  }
}
```

A simple solution is to ensure the method name is different, and not just the variable name prefixed with `set` or `get`.

```
class MyPage extends page {
  static content = {
    nameField { $('#inputField') }
  }

  setName(String someValue) {
    inputField.value(someValue)
  }
}
```

## Geb

## Spock

## Gradle

# Questions and issues

Please ask questions on our [Slack Channel][slack_channel] and raise issues in [BDDStack issue tracker][issue_tracker].
