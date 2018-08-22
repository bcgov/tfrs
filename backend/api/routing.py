from channels.auth import AuthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url

from api.middleware import SMUserMiddleware
from api.notifications.notifications import NotificationDispatch
from api.siteminder_channels_middleware import SMUserAuth

ws_urls = [
    url(r'^ws/notifications/(?P<channel_name>[^/]+)/$', NotificationDispatch)
]

application = ProtocolTypeRouter({
    'websocket':
        SMUserAuth(
                URLRouter(
                          ws_urls
                         )
                        )

})
