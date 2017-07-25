class SMUserMiddleware:

    def process_request(self,request):
        request.META.update({'HTTP_SM_USER':1})
        pass
