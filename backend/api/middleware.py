class SMUserMiddleware(object):

    def process_request(self, request):
        """Map all the Siteminder headers in case they change in the future
        """

        # Only BCeID
        request.META.update({
            'HTTP_SMAUTH_BUSINESSGUID':
                request.META.get('HTTP_SMGOV_BUSINESSGUID', ''),
            'HTTP_SMAUTH_BUSINESSLEGALNAME':
                request.META.get('HTTP_SMGOV_BUSINESSLEGALNAME', ''),
        })

        request.META.update({
            'HTTP_SMAUTH_USERDISPLAYNAME':
                request.META.get('HTTP_SMGOV_USERDISPLAYNAME', ''),
            'HTTP_SMAUTH_USEREMAIL':
                request.META.get('HTTP_SMGOV_USEREMAIL', ''),
            'HTTP_SMAUTH_USERGUID':
                request.META.get('HTTP_SMGOV_USERGUID', ''),
            'HTTP_SMAUTH_USERIDENTIFIER':
                request.META.get('HTTP_SMGOV_USERIDENTIFIER', ''),
            'HTTP_SMAUTH_USERTYPE':
                request.META.get('HTTP_SMGOV_USERTYPE', ''),
            'HTTP_SMAUTH_DIRNAME':
                request.META.get('HTTP_SM_AUTHDIRNAME', ''),
            'HTTP_SMAUTH_DIROID':
                request.META.get('HTTP_SM_AUTHDIROID', ''),
            'HTTP_SMAUTH_SERVERSESSIONID':
                request.META.get('HTTP_SM_SERVERSESSIONID', ''),
            'HTTP_SMAUTH_TIMETOEXPIRE':
                request.META.get('HTTP_SM_TIMETOEXPIRE', ''),
            'HTTP_SMAUTH_UNIVERSALID':
                request.META.get('HTTP_SM_UNIVERSALID', ''),
            'HTTP_SMAUTH_USER':
                request.META.get('HTTP_SM_USER', '')
        })