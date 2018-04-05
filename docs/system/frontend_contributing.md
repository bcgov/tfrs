# Contributing to TFRS (Front-End)
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Separation of Presentational Components and Container Components
All your business logic, data handling and manipulation should be in a **container component**, a file called `<File>Container.js`. Display or **presentational components** (JSX Template files) should be under a folder called `components` and must not contain any non-ui logic. Read more about it [here](../system/frontend_presentational_and_container_components.md).

## Use a Consistent Coding Style
Ideally, we'd like to follow the [airbnb style guide](https://github.com/airbnb/javascript)

<!-- Install [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) from npm
 -->

 `$ ./node_modules/.bin/eslint frontend/src/`
