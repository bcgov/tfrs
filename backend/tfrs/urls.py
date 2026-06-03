from django.urls import include, path, re_path
from django.contrib import admin
# import debug_toolbar
from . import views

urlpatterns = [
    re_path(r'^$', views.blank),
    re_path(r'^api/', include('api.urls')),
    re_path(r'^health$', views.health),
    re_path(r'^api_admin/', admin.site.urls),
    # path('__debug__/', include(debug_toolbar.urls)),
]
