from rest_framework import serializers

from api.serializers import CreditTradeStatusSerializer
from api.serializers import FuelSupplierSerializer
from api.serializers import CreditTradeTypeSerializer
from api.serializers import CreditTradeZeroReasonSerializer

from api.models import CreditTrade
from api.models import CreditTradeHistory


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

