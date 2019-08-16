from typing import List

from api.models.CreditTrade import CreditTrade
from api.models.Document import Document
from api.models.Organization import Organization
from api.models.Role import Role
from api.models.User import User
from api.notifications.notification_types import NotificationType
from api.notifications.notifications import AMQPNotificationService
from tfrs.celery import app as celery_app


def async_send_notifications(notifications: List):
    for n in notifications:
        async_send_notification.delay(**n)


@celery_app.task
def async_send_notification(
        message: str = None,
        interested_organization_id=None,
        interested_role_names: List[str] = [],
        related_credit_trade_id=None,
        related_document_id=None,
        related_organization_id=None,
        related_user_id=None,
        is_error: bool = False,
        is_warning: bool = False,
        is_global: bool = False,
        notification_type: NotificationType = None,
        originating_user_id=None):
    print('sending notification')

    interested_organization = Organization.objects.get(
        id=interested_organization_id) if interested_organization_id else None

    interested_roles = Role.objects.filter(
        name__in=interested_role_names).all()

    related_credit_trade = CreditTrade.objects.get(
        id=related_credit_trade_id) if related_credit_trade_id else None

    related_document = Document.objects.get(
        id=related_document_id) if related_document_id else None

    related_organization = Organization.objects.get(
        id=related_organization_id) if related_organization_id else None

    related_user = User.objects.get(
        id=related_user_id) if related_user_id else None

    originating_user = User.objects.get(
        id=originating_user_id) if originating_user_id else None
    notification_type_value = NotificationType(notification_type)

    AMQPNotificationService.send_notification(
        message,
        interested_organization,
        interested_roles,
        related_credit_trade,
        related_document,
        related_organization,
        related_user,
        is_error,
        is_warning,
        is_global,
        notification_type_value,
        originating_user
    )
