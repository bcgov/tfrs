import json

from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.views import generic
from django.utils import timezone

from .models import FuelSupply, FuelSupplier, FuelClass, FuelType


def dashboard(request):
    table_data = [
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}}
    ]
    notifications = [
        {'id': 1, 'subject': 'Credit Transfer Proposed', 'date': '7/12/2015', 'flagged': False, 'message': 'A credit transfer was proposed from exxon'},
        {'id': 2, 'subject': 'Credits Awarded - Fuel Supply', 'date': '4/3/2015', 'flagged': True, 'message': 'Credits have been awarded by Fuel Supply'},
        {'id': 3, 'subject': 'Credits Awarded - Part Three', 'date': '6/21/2014', 'flagged': False, 'message': 'Credits have been awarded by Part Three Agreement'}
    ]
    return render(request, 'dashboard.html', {
        'table_data': json.dumps(table_data),
        'notifications': json.dumps(notifications)
    })

def account_activity(request):
    table_data = [
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'effectiveDate': 'Directors Approval', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': 'January 2015'}}
    ]
    return render(request, 'account-activity.html', {'table_data': json.dumps(table_data)})

def new_transaction(request):
    return render(request, 'new-transaction.html', {})

def transaction_summary(request):
    transaction = {
        'partner': 'Chevron',
        'partner_adddress': '1234 Douglas Road, V3G 6N1, Victoria, BC',
        'type': 'Purchase',
        'quantity': 200,
        'fair_market_value': '$200',
        'total_value': '$40,000',
        'compliance_period': 'January 2015',
        'effective_date': 'Directors Approval'
    }
    return render(request, 'transaction-summary.html', {'transaction': transaction})

def settings(request):
    return render(request, 'settings.html', {})

def notifications(request):
    notifications = [
        {'id': 1, 'subject': 'Credit Transfer Proposed', 'date': '7/12/2015', 'flagged': False, 'message': 'A credit transfer was proposed from exxon'},
        {'id': 2, 'subject': 'Credits Awarded - Fuel Supply', 'date': '4/3/2015', 'flagged': True, 'message': 'Credits have been awarded by Fuel Supply'},
        {'id': 3, 'subject': 'Credits Awarded - Part Three', 'date': '6/21/2014', 'flagged': False, 'message': 'Credits have been awarded by Part Three Agreement'}
    ]
    return render(request, 'notifications.html', {'notifications': notifications})

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


