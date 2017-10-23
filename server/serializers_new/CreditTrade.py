from rest_framework import serializers

from server.serializers import CreditTradeStatusSerializer
from server.serializers import FuelSupplierSerializer
from server.serializers import CreditTradeTypeSerializer
from server.serializers import CreditTradeZeroReasonSerializer

from server.models import CreditTrade
from server.models import CreditTradeHistory


class CreditTradeCreateSerializer(serializers.ModelSerializer):
    creditTradeStatusFK = CreditTradeStatusSerializer
    initiatorFK = FuelSupplierSerializer
    respondentFK = FuelSupplierSerializer
    creditTradeTypeFK = CreditTradeTypeSerializer
    creditTradeZeroReasonFK = CreditTradeZeroReasonSerializer

    class Meta:
        model = CreditTrade
        fields = '__all__'


class CreditTradeSerializer(serializers.ModelSerializer):

    creditTradeStatusFK = CreditTradeStatusSerializer
    initiatorFK = FuelSupplierSerializer
    respondentFK = FuelSupplierSerializer
    creditTradeTypeFK = CreditTradeTypeSerializer
    creditTradeZeroReasonFK = CreditTradeZeroReasonSerializer

    class Meta:
        model = CreditTrade
        exclude = ('note',)


class CreditTradeHistorySerializer(serializers.ModelSerializer):

    creditTradeStatusFK = CreditTradeStatusSerializer
    initiatorFK = FuelSupplierSerializer
    respondentFK = FuelSupplierSerializer
    creditTradeTypeFK = CreditTradeTypeSerializer
    creditTradeZeroReasonFK = CreditTradeZeroReasonSerializer

    class Meta:
        model = CreditTradeHistory
        fields = '__all__'

