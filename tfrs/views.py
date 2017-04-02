import json

from django.http import HttpResponse
from django.shortcuts import render

def dashboard(request):
    table_data = [
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '5/12/2017', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '9/7/2018', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}}
    ]
    notifications = [
        {'id': 1, 'subject': 'Credit Transfer Proposed', 'date': '2 dys ago', 'flagged': False, 'message': 'A credit transfer was proposed from exxon'},
        {'id': 2, 'subject': 'Credits Awarded - Fuel Supply', 'date': '3 wk ago', 'flagged': True, 'message': 'Credits have been awarded by Fuel Supply'},
        {'id': 3, 'subject': 'Credits Awarded - Part Three', 'date': '2 mos ago', 'flagged': False, 'message': 'Credits have been awarded by Part Three Agreement'}
    ]
    return render(request, 'dashboard.html', {
        'table_data': json.dumps(table_data),
        'notifications': notifications
    })

def account_activity(request):
    table_data = [
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '3/8/2018', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '3/8/2018', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '3/8/2018', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}},
        {'transaction':{ 'fuelSupplier': 'Chevron', 'type': 'Sold', 'partner': 'Exxon', 'quantity': 5, 'fairMarketValue': '$100', 'lastModified': '2/5/2017', 'effectiveDate': '', 'status': 'Pending', 'balance': 1000, 'compliancePeriod': '2015'}}
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
        'compliance_period': '2015',
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
