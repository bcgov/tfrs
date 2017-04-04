$('.btn-toggle').click(function() {
  $(this).find('.btn').toggleClass('active');  

  if ($(this).find('.btn-primary').size()>0) {
    $(this).find('.btn').toggleClass('btn-primary');
  }
  if ($(this).find('.btn-danger').size()>0) {
    $(this).find('.btn').toggleClass('btn-danger');
  }
  if ($(this).find('.btn-success').size()>0) {
    $(this).find('.btn').toggleClass('btn-success');
  }
  if ($(this).find('.btn-info').size()>0) {
    $(this).find('.btn').toggleClass('btn-info');
  }

  $(this).find('.btn').toggleClass('btn-default');

});

$('#marketValue').on('keyup mouseup', function() {
  $('#totalTransactionValue').text(moneyFormat($(this).val() * $('#creditsTransfered').val()));
});

$('#creditsTransfered').on('keyup mouseup', function() {
  $('#totalTransactionValue').text(moneyFormat($(this).val() * $('#marketValue').val()));
});

function moneyFormat(num) {
  return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var columns = [
  [{
    "field": "transaction.fuelSupplier",
    "title": "Fuel<br>Supplier",
    "colspan": 1,
    "sortable": true,
    "rowspan": 1
  }, {
    "field": "transaction.status",
    "title": "Transaction<br>Status",
    "sortable": true,
    "colspan": 1,
    "rowspan": 1
  }, /*{
    "field": "transaction.compliancePeriod",
    "title": "Compliance<br>Period",
    "sortable": true,
    "colspan": 1,
    "rowspan": 1
  },*/ {
    "field": "transaction.lastModified",
    "title": "Last<br>Modified",
    "sortable": true,
    "colspan": 1,
    "rowspan": 1
  }, {
    "field": "transaction.effectiveDate",
    "title": "Effective<br>Date",
    "sortable": true,
    "colspan": 1,
    "rowspan": 1
  }, {
      "field": "transaction.type",
      "title": "Transaction<br>Type",
      "colspan": 1,
      "sortable": true,
      "rowspan": 1
    }, {
      "field": "transaction.partner",
      "title": "Transaction<br>Partner",
      "sortable": true,
      "colspan": 1,
      "rowspan": 1
    }, {
      "field": "transaction.quantity",
      "title": "Number of<br>Credits",
      "sortable": true,
      "colspan": 1,
      "rowspan": 1
    }, {
      "field": "transaction.fairMarketValue",
      "title": "Fair Market<br>Value Per Credit",
      "sortable": true,
      "colspan": 1,
      "rowspan": 1
    }, {
      "field": "transaction.balance",
      "title": "Balance at Time<br>of Transaction",
      "sortable": true,
      "colspan": 1,
      "rowspan": 1
    }]
];

$(function() {
  $("#effectiveDate").datepicker({
    minDate: 0
  });
  $('#recent-account-activity-table').bootstrapTable({
    data: data,
    columns: columns,
  });

  $('#account-activity-table').bootstrapTable({
    data: data,
    columns: columns,
    pagination: true,
    search: true,
    showExport: true,
    reorderableColumns: true,
  });
});
