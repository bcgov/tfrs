Unit Tests
----------------
**Adding a unit test**

We use nose for the test runner. If you create a new test file, make sure nose can find it by opening `nose.cfg` and adding the filepath to the second line (`tests=...`)

**Older code (we'll call this version `codegen`)**

Uses the following files:
- `fakedata.py` - contains some fake data in python format
- `test_api_complex.py` - doesn't contain anything
- `test_api_custom.py` - custom written tests
- `test_api_simple.py` - generated initially, but customized later on

There were attempts to refactor these on-the-go, but majority of the codebase still reflects the older style (non-PEP8 compliant).

**Newer code (let's call this version `pre-mvp`)**
- `fake_api_calls.py` - some helper api calls. This was created before the fixtures made it into the codebase
- `fixtures/*` - test & initial data in json format
- `test_api.py` - tests the basic API functions

Self-explanatory unit tests:
- `test_authentication.py`
- `test_credit_trades.py`
- `test_utils.py`
