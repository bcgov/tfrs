
from django.http import HttpResponse
from api.models.FuelSupplier import FuelSupplier


def health(request):
    """
    Health check for OpenShift
    """
    return HttpResponse(FuelSupplier.objects.count())


def blank(request):
    return HttpResponse('')
