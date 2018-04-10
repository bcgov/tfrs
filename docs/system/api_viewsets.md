ViewSets
------

Django is an MVT (Model View Template) framework. In this case, as we're simply exposing API endpoints with Django Rest Framework, we're not really using templates. You can think of the templates as the [serializers](api_serializers.md)


**Older code (we'll call this version `codegen`)**

The generated code produced a module called `views.py` which contains a lot of logic. The urls generated located in `urls.py` all point to functions in `views.py`.

It looks like there was a second module created called `views_custom.py` where non-generated code had been written.

All these uses the `GenericApiView` or `APIView` from the Django Rest Framework.

The urls are all defined in a big array variable `urlpatterns` and are defined manually one by one.

**Newer code (let's call this version `pre-mvp`)**

(*[From Django REST Framework docs](http://www.django-rest-framework.org/api-guide/viewsets/#modelviewset)*)
Django Rest Framework allows you to combine the logic for a set of related views in a single class, a `ViewSet`. It also goes a step above this by providing a `ModelViewSet` which includes implementations for various actions, by mixing in the behavior of the various mixin classes.

The actions provided by the ModelViewSet class are `.list()`, `.retrieve()`, `.create()`, `.update()`, `.partial_update()`, and `.destroy()`.

------

Since most of the code are basic CRUD logic, we started to move towards using a `ModelViewSet` instead. Most of the newer code are written in this format, under the `viewsets` folder.

This makes the `urls.py` cleaner as well, by only having to fine one line of code for each `ModelViewSet` like this:
`router.register(r'credit_trades', CreditTradeViewSet)`
