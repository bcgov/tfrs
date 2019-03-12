# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-02-11 21:27
from __future__ import unicode_literals

import api.notifications.notification_types
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0077_auto_20190211_1930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notificationsubscription',
            name='notification_type',
            field=models.CharField(choices=[(api.notifications.notification_types.NotificationType('Credit Transfer Proposal Created'), 'Credit Transfer Proposal Created'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Signed 1/2'), 'Credit Transfer Proposal Signed 1/2'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Signed 2/2'), 'Credit Transfer Proposal Signed 2/2'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Refused'), 'Credit Transfer Proposal Refused'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Accepted'), 'Credit Transfer Proposal Accepted'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Recommended For Approval'), 'Credit Transfer Proposal Recommended For Approval'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Recommended For Declination'), 'Credit Transfer Proposal Recommended For Declination'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Declined'), 'Credit Transfer Proposal Declined'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Approved'), 'Credit Transfer Proposal Approved'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Rescinded'), 'Credit Transfer Proposal Rescinded'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Comment Created Or Updated'), 'Credit Transfer Proposal Comment Created Or Updated'), (api.notifications.notification_types.NotificationType('Credit Transfer Proposal Internal Comment Created Or Updated'), 'Credit Transfer Proposal Internal Comment Created Or Updated'), (api.notifications.notification_types.NotificationType('PVR Created'), 'PVR Created'), (api.notifications.notification_types.NotificationType('PVR Recommended For Approval'), 'PVR Recommended For Approval'), (api.notifications.notification_types.NotificationType('PVR Rescinded'), 'PVR Rescinded'), (api.notifications.notification_types.NotificationType('PVR Pulled Back'), 'PVR Pulled Back'), (api.notifications.notification_types.NotificationType('PVR Declined'), 'PVR Declined'), (api.notifications.notification_types.NotificationType('PVR Approved'), 'PVR Approved'), (api.notifications.notification_types.NotificationType('PVR Comment Created Or Updated'), 'PVR Comment Created Or Updated'), (api.notifications.notification_types.NotificationType('PVR Internal Comment Created Or Updated'), 'PVR Internal Comment Created Or Updated'), (api.notifications.notification_types.NotificationType('PVR Returned to Analyst'), 'PVR Returned to Analyst'), (api.notifications.notification_types.NotificationType('Document Pending Submission'), 'Document Pending Submission'), (api.notifications.notification_types.NotificationType('Document Submitted'), 'Document Submitted'), (api.notifications.notification_types.NotificationType('Document Security Scan Failed'), 'Document Security Scan Failed'), (api.notifications.notification_types.NotificationType('Document Received'), 'Document Received'), (api.notifications.notification_types.NotificationType('Document Archived'), 'Document Archived')], max_length=128),
        ),
    ]
