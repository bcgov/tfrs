from django.shortcuts import render

# Create your views here.



class AuditableMixin(object,):
    def __init__(self, *args, **kwargs):
        return super(AuditableMixin, self).__init__(*args, **kwargs)
