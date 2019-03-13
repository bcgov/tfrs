from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from api.models.Document import Document
from api.models.CreditTrade import CreditTrade
from api.serializers.CreditTradeType import CreditTradeTypeSerializer
from api.serializers.CreditTradeStatus import CreditTradeStatusMinSerializer
from api.serializers.DocumentMilestone import DocumentMilestoneSerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer


class DocumentAuxiliarySerializer(serializers.ModelSerializer):
    """
    Minimal Serializer for Documents as a property of CreditTrade
    """

    status = DocumentStatusSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    milestone = serializers.SerializerMethodField()

    def get_milestone(self, obj):
        """
        Additional information for milestone evidences
        """
        if obj.type.the_type == 'Evidence':
            milestone = obj.milestone
            serializer = DocumentMilestoneSerializer(milestone)

            return serializer.data

        return None

    class Meta:
        model = Document
        fields = (
            'id', 'title', 'status', 'type', 'milestone'
        )
        read_only_fields = (
            'id', 'title', 'status', 'type', 'milestone'
        )


class CreditTradeAuxiliarySerializer(serializers.ModelSerializer):
    """
    Credit Trade Serializer with just the basic information
    for when used as a property of Document
    """
    status = CreditTradeStatusMinSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'type')


class CreditTradeLinkSerializer(serializers.Serializer):
    """
    Credit Trade by-id Serializer
    """
    credit_trade = PrimaryKeyRelatedField(queryset=CreditTrade.objects.all())
