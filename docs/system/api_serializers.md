Serializers
--------
(*[From Django REST Framework docs](http://www.django-rest-framework.org/api-guide/serializers/)*)
Currently, all serializers are written under a single module called `serializers.py`

In the future, it would be best to create a package/folder for `serializers` and splitting the classes into different appropriate modules for organization.

When writing new features or having some time to refactor, it would be wise to consider doing this.

**Nested objects**
Dealing with nested objects are a little complicated in DRF. The current codebase has a few examples that show a nested-object read-only serializer.

Currently, we have no writable nested-object serializers as they are more complicated to implement with DRF.
