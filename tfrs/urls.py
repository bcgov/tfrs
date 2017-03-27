from django.conf.urls import include, url
from django.contrib import admin

from welcome.views import index, health
from . import views

urlpatterns = [
    url(r'^$', views.dashboard),
    url(r'^account-activity/$', views.account_activity),
    url(r'^new-transaction/$', views.new_transaction),
    url(r'^test$', views.SupplierView.as_view(), name='supplier_index'),
    url(r'^test/(?P<pk>[0-9]+)/$', views.FuelSupplyView.as_view(), name='supply'),
    url(r'^health$', health),
    url(r'^admin/', include(admin.site.urls)),
]
