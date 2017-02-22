from django.conf.urls import include, url
from django.contrib import admin

from welcome.views import index, health
from . import views

urlpatterns = [
    # Examples:
    # url(r'^$', 'project.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', index),
    url(r'^test$', views.SupplierView.as_view(), name='supplier_index'),
    url(r'^test/(?P<pk>[0-9]+)/$', views.FuelSupplyView.as_view(), name='supply'),
    url(r'^health$', health),
    url(r'^admin/', include(admin.site.urls)),
]
