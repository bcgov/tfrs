from django.conf.urls import include, url
from django.contrib import admin

from . import views

urlpatterns = [
    url(r'^$', views.blank),
    url(r'^api/', include('server.urls')),
    url(r'^health$', views.health),
]
