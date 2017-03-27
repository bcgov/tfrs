from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
#from django.urls import reverse
from django.views import generic
from django.utils import timezone

from .models import FuelSupply, FuelSupplier, FuelClass, FuelType


def dashboard(request):
    return render(request, 'dashboard.html', [])

def account_activity(request):
    return render(request, 'account-activity.html', [])

def new_transaction(request):
    return render(request, 'new-transaction.html', [])


class SupplierView(generic.ListView):
    template_name = 'tfrs/index.html'
    context_object_name = 'supplier_list'

    def get_queryset(self):
        """
        Return the list of suppliers.
        """
        return FuelSupplier.objects.order_by('-name')



class FuelSupplyView(generic.ListView):
    model = FuelSupplier
    template_name = 'tfrs/fuelSupply.html'
    context_object_name = 'latest_supply_list'

    def get_queryset(self):
        """
        Return the last five updated supply records.
        """
        return FuelSupply.objects.filter(
            last_modified__lte=timezone.now()
        ).order_by('-last_modified')[:5]


