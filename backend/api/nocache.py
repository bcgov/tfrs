import re

from django.utils.cache import add_never_cache_headers


class NoCacheMiddleware(object):
    """Add No-cache headers to all responses if detect IE UA"""

    IE_DETECTION_RE = [
        re.compile('Trident/.*rv:(\d+\.\d*)'),
        re.compile('MSIE')
    ]

    @staticmethod
    def process_response(request, response):

        if 'HTTP_USER_AGENT' not in request.META:
            return response

        user_agent = request.META['HTTP_USER_AGENT']
        is_ie = False

        for expr in NoCacheMiddleware.IE_DETECTION_RE:
            if expr.search(user_agent):
                is_ie = True
                break

        if is_ie:
            add_never_cache_headers(response)

        return response
