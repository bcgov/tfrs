from django.conf.urls import url
from django.urls import path, include
from django.contrib import admin
# import debug_toolbar
from . import views
from django.urls import path

urlpatterns = [
    url(r'^$', views.blank),
    url(r'^api/', include('api.urls')),
    url(r'^health$', views.health),
    url(r'^api_admin/', admin.site.urls),
    # path('__debug__/', include(debug_toolbar.urls)),
]
