# Contributing to TFRS (Backend/API)
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

## Code Stability & Consistency
* For any new feature, make sure to write your unit tests first.
* Try to follow [PEP8](https://pep8.org/), but you may ignore the line length limit if following it would make the code uglier.
* Make sure your tests are passing before pushing
* Try to follow the [Zen of Python](https://www.python.org/dev/peps/pep-0020/)

## Testing
### Adding a unit test
- We use nose for the test runner. If you create a new test file, make sure nose can find it by opening `nose.cfg` and adding the filepath to the second line (`tests=...`)
