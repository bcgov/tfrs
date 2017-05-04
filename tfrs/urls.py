from django.conf.urls import include, url
from django.contrib import admin

from . import views

urlpatterns = [
    url(r'^$', views.dashboard),
    url(r'^account-activity/$', views.account_activity),
    url(r'^settings/$', views.settings),
    url(r'^test/$', views.settings),
    url(r'^notifications/$', views.notifications),
    url(r'^db-notifications/$', views.db_notifications),
    url(r'^new-transaction/$', views.new_transaction),
    url(r'^transaction-summary/$', views.transaction_summary),
 #   url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('server.urls')),
    url(r'^health$', views.health),
]